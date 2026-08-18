import os
import boto3
import shutil
from pathlib import Path
from botocore.exceptions import ClientError
from fastapi import UploadFile
import logging

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.backend = os.getenv("STORAGE_BACKEND", "local").lower()
        self.upload_dir = Path("uploads")
        
        if self.backend == "local":
            self.upload_dir.mkdir(exist_ok=True)
            logger.info("StorageService initialized with LOCAL backend.")
        else:
            self.s3_bucket = os.getenv("S3_BUCKET_NAME")
            self.s3 = boto3.client(
                "s3",
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION"),
                endpoint_url=os.getenv("AWS_ENDPOINT_URL") # Useful for R2
            )
            logger.info(f"StorageService initialized with S3/R2 backend. Bucket: {self.s3_bucket}")

    def save_upload_file(self, upload_file: UploadFile, stored_filename: str) -> str:
        """Saves an UploadFile and returns the access path/key."""
        if self.backend == "local":
            filepath = self.upload_dir / stored_filename
            with filepath.open("wb") as buffer:
                shutil.copyfileobj(upload_file.file, buffer)
            return str(filepath)
        else:
            upload_file.file.seek(0)
            self.s3.upload_fileobj(
                upload_file.file,
                self.s3_bucket,
                stored_filename,
            )
            return stored_filename

    def generate_presigned_upload_url(self, stored_filename: str, content_type: str = "text/csv") -> str:
        """Generates a presigned URL for direct client-to-S3 uploads."""
        if self.backend == "local":
            raise NotImplementedError("Presigned URLs are not supported with local storage.")
            
        try:
            response = self.s3.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': self.s3_bucket,
                    'Key': stored_filename,
                    'ContentType': content_type
                },
                ExpiresIn=3600 # 1 hour
            )
            return response
        except ClientError as e:
            logger.error(f"Failed to generate presigned URL for {stored_filename}: {e}")
            raise

    def get_file_path_for_reading(self, stored_filename: str) -> str:
        """
        Returns a local filepath for reading. 
        If on S3, downloads to a temp file and returns that path.
        The caller must manage temp file cleanup if needed, but for our case
        we often just load it in pandas. We can download it to 'temp_downloads'.
        """
        if self.backend == "local":
            filepath = self.upload_dir / stored_filename
            if not filepath.exists():
                raise FileNotFoundError(f"File not found: {filepath}")
            return str(filepath)
        else:
            # Ensure a temp directory exists
            temp_dir = Path("temp_downloads")
            temp_dir.mkdir(exist_ok=True)
            local_path = temp_dir / stored_filename
            
            # Download if not already there (cache)
            if not local_path.exists():
                try:
                    self.s3.download_file(self.s3_bucket, stored_filename, str(local_path))
                except ClientError as e:
                    logger.error(f"Failed to download {stored_filename} from S3: {e}")
                    raise FileNotFoundError(f"File not found in S3: {stored_filename}")
            return str(local_path)
            
    def delete_file(self, stored_filename: str) -> None:
        if self.backend == "local":
            filepath = self.upload_dir / stored_filename
            if filepath.exists():
                filepath.unlink()
        else:
            try:
                self.s3.delete_object(Bucket=self.s3_bucket, Key=stored_filename)
                
                # Cleanup cached download
                temp_dir = Path("temp_downloads")
                local_path = temp_dir / stored_filename
                if local_path.exists():
                    local_path.unlink()
            except ClientError as e:
                logger.error(f"Failed to delete {stored_filename} from S3: {e}")
