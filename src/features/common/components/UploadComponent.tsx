import React, { useCallback, useEffect, useState } from 'react';
import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { Alert, Box, Button, IconButton, Typography, CircularProgress, Stack, Paper } from '@mui/material';
import { CloudUpload, DocumentImport, TrashCan, Upload } from '@carbon/icons-react';

interface UploadComponentProps {
  title?: string;
  acceptedFileTypes: Accept;
  setFilesValue: (value: File[]) => void;
  maxSize?: number;
  uploadHintMessage?: string;
  uploadState?: 'INITIAL' | 'UPLOADING';
  onUpload?: (files: File[]) => void;
  initialFiles?: File[];
  multiple?: boolean;
}

interface FileAlertProps {
  fileName: string;
  severity: 'success' | 'error';
  icon: JSX.Element;
  errors?: string[];
  handleDelete: (fileName: string) => void;
}

const FileAlert = ({ fileName, severity, icon, errors, handleDelete }: FileAlertProps) => (
  <Alert
    variant="outlined"
    severity={severity}
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      margin: 1,
      padding: 1,
      wordWrap: 'break-word',
    }}
    icon={icon}
    action={
      <IconButton
        onClick={e => {
          e.stopPropagation();
          handleDelete(fileName);
        }}
      >
        <TrashCan />
      </IconButton>
    }
  >
    <Typography variant="body2">{fileName}</Typography>
    {errors && <Typography variant="caption">{errors.join(', ')}</Typography>}
  </Alert>
);

export const UploadComponent = ({
  title,
  acceptedFileTypes,
  maxSize,
  setFilesValue,
  uploadState = 'INITIAL',
  onUpload,
  uploadHintMessage,
  initialFiles = [],
  multiple = true,
}: UploadComponentProps) => {
  const [fileList, setFileList] = useState<File[]>(initialFiles);
  const [fileListRejected, setFileListRejected] = useState<FileRejection[]>([]);

  const validator = useCallback(
    (file: File) => {
      if (maxSize && file.size > maxSize) {
        return {
          code: 'size-too-large',
          message: `File too large!`,
        };
      }
      return null;
    },
    [maxSize],
  );

  const handleFilesAccepted = (acceptedFiles: File[]) => {
    if (multiple) {
      setFileList(currentFiles => [...currentFiles, ...acceptedFiles]);
    } else {
      setFileList(acceptedFiles);
    }
    setFilesValue(acceptedFiles);
    onUpload?.(acceptedFiles);
  };

  const { fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFilesAccepted,
    validator,
    accept: acceptedFileTypes,
    multiple,
  });

  useEffect(() => {
    setFileListRejected([...fileRejections]);
  }, [fileRejections]);

  const handleDeleteFile = (fileName: string) => {
    const updatedFiles = fileList.filter(f => f.name !== fileName);
    setFileList(updatedFiles);
    setFilesValue(updatedFiles);
  };

  const handleDeleteErrorFile = (fileName: string) => {
    const updatedFiles = fileListRejected.filter(f => f.file.name !== fileName);
    setFileListRejected(updatedFiles);
  };

  return (
    <Stack spacing={2}>
      {title && (
        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
          {title}
        </Typography>
      )}

      <Paper
        variant="outlined"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 2,
          border: isDragActive ? '1px dashed var(--mui-palette-primary-main)' : '1px solid var(--mui-palette-divider)',
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
          <CloudUpload size={24} />
          <Typography sx={{ marginY: 2 }}>Drag and drop folders or files, click to select or</Typography>
          <Button variant="contained" onClick={e => e.preventDefault()} startIcon={<Upload size={20} />}>
            Upload
          </Button>
          {uploadHintMessage && (
            <Typography variant="body2" color="textSecondary">
              {uploadHintMessage}
            </Typography>
          )}
        </Stack>

        {(fileList.length > 0 || fileListRejected.length > 0) && (
          <Box sx={{ width: '100%', marginY: 2 }}>
            {fileList.map((file, index) => (
              <FileAlert
                key={file.name + index}
                fileName={file.name}
                severity="success"
                icon={<DocumentImport size={20} />}
                handleDelete={handleDeleteFile}
              />
            ))}

            {fileListRejected.map(({ file, errors }, index) => (
              <FileAlert
                key={file.name + index}
                fileName={file.name}
                severity="error"
                icon={<DocumentImport size={20} />}
                handleDelete={handleDeleteErrorFile}
                errors={errors.map(e => e.message)}
              />
            ))}
          </Box>
        )}
      </Paper>

      {uploadState === 'UPLOADING' && (
        <Stack direction="row" sx={{ justifyContent: 'center' }}>
          <CircularProgress />
        </Stack>
      )}
    </Stack>
  );
};
