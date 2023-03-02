import React, { useState } from 'react';
import { useFiles } from '../../hooks/useFiles';
import {
  Alert, Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton
} from '@mui/material';
import { ArticleOutlined as ArticleIcon, Folder as FolderIcon, ArrowBack as ArrowBackIcon, Delete as DeleteIcon, FileUpload as FileUploadIcon } from '@mui/icons-material';
import Grid from '@mui/system/Unstable_Grid';
import { download } from '../../src/download';
import { useFileDelete } from '../../hooks/useFileDelete';
import { useFileUpload } from '../../hooks/useFileUpload';

type DeleteFileButtonProps = {
  path: string;
  token: string;
}

const DeleteFileButton: React.FC<DeleteFileButtonProps> = ({ path, token }) => {
  const { deleteFile } = useFileDelete(path, token);

  return (
    <IconButton edge="end" aria-label="delete" onClick={() => deleteFile()}>
      <DeleteIcon/>
    </IconButton>
  );
}

type FileBrowserProps = {
  token: string;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ token }) => {
  const [path, setPath] = useState<string>('');
  const { files, isLoading: isFilesLoading, isError: isFilesError } = useFiles(token, path);
  const { openFileUploadDialog } = useFileUpload(path, token);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
        <Button
          startIcon={<FileUploadIcon />}
          variant='contained'
          color='success'
          onClick={() => openFileUploadDialog()}
        >
          Upload
        </Button>
      </Grid>
      <Grid xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
        <Paper elevation={2}>
          {isFilesLoading
            ? <Skeleton variant='rectangular' />
            : isFilesError
              ? <Alert severity='error'>Failed to load files</Alert>
              : <List>
                  {path !== '' && <ListItemButton
                    onClick={() => setPath(prevState => {
                      if (prevState.lastIndexOf('/') === -1) {
                        return '';
                      } else {
                        return prevState.slice(0, prevState.lastIndexOf('/'))
                      }
                    })}
                  >
                    <ListItemIcon><ArrowBackIcon /></ListItemIcon>
                    <ListItemText>..</ListItemText>
                  </ListItemButton>}
                  {files.map(file => {
                    return (
                      <ListItem disablePadding key={file.name} secondaryAction={
                        <DeleteFileButton path={path === '' ? file.name : `${path}/${file.name}`} token={token} />
                      }>
                        <ListItemButton
                          onClick={() => {
                            if (file.isDirectory) {
                              setPath(prevState => {
                                if (prevState === '') {
                                  return file.name;
                                } else {
                                  return prevState + '/' + file.name;
                                }
                              });
                            } else {
                              if (path === '') {
                                download(file.name, `/files/${encodeURIComponent(file.name)}`, token);
                              } else {
                                download(file.name, `/files/${encodeURIComponent(path)}%2F${encodeURIComponent(file.name)}`, token);
                              }
                            }
                          }}
                        >
                          <ListItemIcon>{file.isDirectory ? <FolderIcon /> : <ArticleIcon />}</ListItemIcon>
                          <ListItemText>{file.name}</ListItemText>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
          }
        </Paper>
      </Grid>
    </Grid>
  )
}