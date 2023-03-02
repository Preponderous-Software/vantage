import { Button, Unstable_Grid2 as Grid, Paper, Skeleton, TextField, Typography, Box, Alert } from '@mui/material';
import React, {
  ChangeEvent,
  KeyboardEvent,
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode
} from 'react';
import { useServerLog } from '../../hooks/useServerLog';
import styles from './ServerLog.module.css'
import { useServer } from '../../hooks/useServer';

type ServerLogProps = {
  token: string;
  wsBaseUrl?: string;
}

export const ServerLog: React.FC<ServerLogProps> = ({ token, wsBaseUrl }) => {
  const [wsInstance, setWsInstance] = useState<WebSocket | null>(null);
  const [log, setLog] = useState<Array<string>>([]);
  const [isAtBottom, setAtBottom] = useState<boolean>(true);
  const [command, setCommand] = useState<string>('');
  const { log: requestedLog, isLoading: isLogLoading, isError: isLogError } = useServerLog(token);
  const { server, isLoading: isServerLoading, isError: isServerError, mutate: mutateServer } = useServer(token);

  const logRef = createRef<HTMLDivElement>();

  const ping = useCallback((socket: WebSocket) => {
    socket.send(JSON.stringify({
      'type': 'ping'
    }));
  }, []);

  const updateWs = useCallback((url: string) => {
    const isBrowser = typeof window !== 'undefined';
    if (!isBrowser) return setWsInstance(null);

    // Create a new connection
    const newWs = new WebSocket(url);
    newWs.addEventListener('open', () => {
      setInterval(() => ping(newWs), 30000);
    });
    newWs.addEventListener('message', (event) => {
      if (typeof event.data !== 'string') return;
      const message = JSON.parse(event.data);
      switch (message.type) {
        case 'log':
          setLog(prevLog => [...prevLog, message.text]);
          break;
        case 'pong':
          break;
        case 'status':
          mutateServer();
          break;
      }
    });

    setWsInstance(prevWs => {
      if (prevWs) {
        if (prevWs.readyState === WebSocket.CONNECTING) {
          prevWs.close();
        } else if (prevWs.readyState === WebSocket.OPEN) {
          prevWs.close(1000);
        }
      }
      return newWs;
    });
    return newWs;
  }, [mutateServer, ping]);

  // Open a connection on mount
  useEffect(() => {
    const ws = updateWs(`${wsBaseUrl}/log/?token=${token}`);

    return () => {
      // Cleanup on unmount if ws wasn't closed already
      if (ws) {
        if (ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        } else if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000);
        }
      }
    }
  }, [token, updateWs, wsBaseUrl]);

  useEffect(() => {
    if (requestedLog) {
      setLog(requestedLog);
    }
  }, [requestedLog, setLog]);

  useEffect(() => {
    if (isAtBottom) {
      const logRefCurrent = logRef.current;
      if (logRefCurrent) {
        logRefCurrent.scrollTop = logRefCurrent.scrollHeight - logRefCurrent.clientHeight;
      }
    }
  }, [isAtBottom, logRef]);

  const onScroll = useCallback(() => {
    const logRefCurrent = logRef.current;
    if (!logRefCurrent) return;
    if (logRefCurrent.scrollHeight - (logRefCurrent.clientHeight + logRefCurrent.scrollTop) < 1) {
      setAtBottom(true);
    } else {
      setAtBottom(false);
    }
  }, [setAtBottom, logRef]);

  const handleChangeCommand = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setCommand(event.target.value);
  }, [])

  const onSendCommand = useCallback(() => {
    wsInstance?.send(JSON.stringify({
      type: 'command',
      command: command
    }));

    setCommand('');
  }, [wsInstance, command]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      onSendCommand();
    }
  }, [onSendCommand]);

  const renderedLog = useMemo(() => {
    return log.map((line, index) => {
      const key = `log_${index}`
      return <Typography key={key}>{line}</Typography>
    });
  }, [log]);

  const stopServer = useCallback(() => {
    wsInstance?.send(JSON.stringify({
      'type': 'command',
      'command': 'stop'
    }));
  }, [wsInstance]);

  const startServer = useCallback(() => {
    wsInstance?.send(JSON.stringify({
      'type': 'start'
    }));
  }, [wsInstance]);

  const serverStartStopButton = useMemo(() => {
    if (isServerLoading || isServerError) {
      return <></>;
    } else if (server.isRunning) {
      return (
        <Button
          variant='contained'
          color='error'
          onClick={stopServer}
        >
          Stop
        </Button>
      );
    } else {
      return (
        <Button
          variant='contained'
          color='success'
          onClick={startServer}
        >
          Start
        </Button>
      )
    }
  }, [isServerLoading, isServerError, server, stopServer, startServer]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} lg={6} lgOffset={3}>
          {serverStartStopButton}
        </Grid>
        <Grid xs={12} lg={6} lgOffset={3}>
          <Paper elevation={2} sx={{
            width: '100%',
            padding: '1rem',
            height: '25rem'
          }}>
            {isLogLoading
              ? <Skeleton variant='rectangular' />
              : isLogError || !log ? <Alert severity='error'>Failed to load server log.</Alert>
                : <>
                  <div className={styles.serverLog} ref={logRef} onScroll={onScroll}>
                    {renderedLog}
                  </div>
                </>
            }
          </Paper>
        </Grid>
        <Grid xs={9} md={10} lg={5} lgOffset={3}>
          <TextField
            label='Command'
            variant='outlined'
            sx={{
              width: '100%'
            }}
            value={command}
            onChange={handleChangeCommand}
            disabled={!wsInstance}
            onKeyDown={onKeyDown}
          />
        </Grid>
        <Grid xs={3} md={2} lg={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Button
              variant='contained'
              color='success'
              sx={{
                width: '100%',
              }}
              onClick={onSendCommand}
            >
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}