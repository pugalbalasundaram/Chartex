"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  HardDrive,
  Loader2,
  RefreshCw,
  Search,
  Table2,
  Trash2,
} from "lucide-react";

import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Dataset {
  id: string | number;
  name: string;
  stored_filename: string;
  size: number;
  uploaded_at: string;
  file_type: string;
}

type CellValue =
  | string
  | number
  | boolean
  | null
  | undefined;

type PreviewRow = Record<string, CellValue>;

interface PreviewResponse {
  column_names: string[];
  preview: PreviewRow[];
  summary: {
    rows: number;
    columns: number;
    memory_usage_mb: number;
    quality_score: number;
  };
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 Bytes";

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${parseFloat(
    (bytes / Math.pow(1024, i)).toFixed(2)
  )} ${sizes[i]}`;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function DatasetDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const datasetId = params.id as string;

  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const loadDataset = useCallback(async (showRefreshLoader = false) => {
    if (!datasetId) return;

    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [datasetRes, previewRes] = await Promise.all([
        axios.get(`/datasets/${datasetId}`),
        axios.get(`/datasets/${datasetId}/preview`),
      ]);

      setDataset(datasetRes.data);
      setPreview(previewRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dataset.");
      router.push("/datasets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [datasetId, router]);

  useEffect(() => {
    setTimeout(() => {
      loadDataset();
    }, 0);
  }, [loadDataset]);

  const filteredRows = useMemo(() => {
    if (!preview || !preview.preview) return [];

    if (!search.trim()) return preview.preview;

    const query = search.toLowerCase();

    return preview.preview.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      )
    );
  }, [preview, search]);

  const downloadDataset = async () => {
    try {
      const response = await axios.get(
        `/datasets/${datasetId}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;
      link.download =
        dataset?.name ?? "dataset";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Download started.");
    } catch {
      toast.error("Unable to download dataset.");
    }
  };

  const deleteDataset = async () => {
    try {
      setDeleting(true);

      await axios.delete(`/datasets/${datasetId}`);

      toast.success("Dataset deleted.");

      router.push("/datasets");
    } catch {
      toast.error("Failed to delete dataset.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !dataset || !preview) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-fit gap-2"
            onClick={() => router.push("/datasets")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold tracking-tight">
            {dataset.name}
          </h1>

          <p className="text-muted-foreground">
            Dataset overview and preview
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => loadDataset(true)}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}

            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={downloadDataset}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
                    <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete Dataset?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. The uploaded
                  dataset and all associated records will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={deleteDataset}
                  disabled={deleting}
                >
                  {deleting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rows</CardDescription>

            <CardTitle className="flex items-center gap-2 text-3xl">
              <Table2 className="h-6 w-6 text-primary" />
              {(preview?.summary?.rows ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Columns</CardDescription>

            <CardTitle className="flex items-center gap-2 text-3xl">
              <Database className="h-6 w-6 text-primary" />
              {(preview?.summary?.columns ?? 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>File Size</CardDescription>

            <CardTitle className="flex items-center gap-2 text-3xl">
              <HardDrive className="h-6 w-6 text-primary" />
              {formatBytes(dataset.size)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Type</CardDescription>

            <CardTitle className="flex items-center gap-2 text-3xl">
              <FileSpreadsheet className="h-6 w-6 text-primary" />

              {dataset.file_type.toUpperCase()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Dataset Information
          </CardTitle>

          <CardDescription>
            Metadata about the uploaded file
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Original File Name
              </p>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />

                <span className="font-medium break-all">
                  {dataset.name}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Uploaded At
              </p>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />

                <span>{formatDate(dataset.uploaded_at)}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Badge variant="secondary">
              {(preview?.summary?.rows ?? 0).toLocaleString()} Rows
            </Badge>

            <Badge variant="secondary">
              {(preview?.summary?.columns ?? 0).toLocaleString()} Columns
            </Badge>

            <Badge variant="secondary">
              {formatBytes(dataset.size)}
            </Badge>

            <Badge>
              {dataset.file_type.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>
              Data Preview
            </CardTitle>

            <CardDescription>
              Showing preview rows from the uploaded dataset
            </CardDescription>
          </div>

          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search preview..."
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[600px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {preview.column_names?.map((column) => (
                    <TableHead
                      key={column}
                      className="whitespace-nowrap"
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                                {filteredRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={preview.column_names?.length || 1}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No matching rows found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {preview.column_names?.map((column) => (
                        <TableCell
                          key={`${rowIndex}-${column}`}
                          className="max-w-xs whitespace-nowrap"
                        >
                          {row[column] === null ||
                          row[column] === undefined
                            ? (
                              <span className="text-muted-foreground italic">
                                NULL
                              </span>
                            )
                            : String(row[column])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}