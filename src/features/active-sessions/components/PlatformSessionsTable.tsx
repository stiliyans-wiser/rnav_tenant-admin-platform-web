'use client';

import { useState } from 'react';
import {
  Alert,
  Box,
  Collapse,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChevronDown, ChevronUp } from '@carbon/icons-react';
import { PlatformSessionsResponse, TenantSessionSummary } from '@/features/active-sessions/interfaces/active-sessions.interface';

function formatActivity(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

interface TenantRowProps {
  tenant: TenantSessionSummary;
}

function TenantRow({ tenant }: TenantRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 48 }}>
          {tenant.users.length > 0 && (
            <Tooltip title={open ? 'Collapse users' : 'Expand users'}>
              <IconButton size="small" onClick={() => setOpen(prev => !prev)} aria-label={open ? 'collapse' : 'expand'}>
                {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>{tenant.tenant_name}</TableCell>
        <TableCell align="right">{tenant.active_user_count}</TableCell>
        <TableCell align="right">{tenant.session_count}</TableCell>
        <TableCell>{formatActivity(tenant.last_activity)}</TableCell>
      </TableRow>

      {tenant.users.length > 0 && (
        <TableRow>
          <TableCell colSpan={5} sx={{ py: 0, bgcolor: 'action.hover' }}>
            <Collapse in={open} unmountOnExit>
              <Box sx={{ py: 1, px: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Sessions</TableCell>
                      <TableCell>Last Activity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tenant.users.map(user => (
                      <TableRow key={user.user_id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell align="right">{user.session_count}</TableCell>
                        <TableCell>{formatActivity(user.last_activity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

interface LoadingSkeletonProps {
  rows?: number;
}

function LoadingSkeleton({ rows = 4 }: LoadingSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell sx={{ width: 48 }} />
          <TableCell><Skeleton variant="text" width="60%" /></TableCell>
          <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
          <TableCell align="right"><Skeleton variant="text" width={40} /></TableCell>
          <TableCell><Skeleton variant="text" width="50%" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

interface PlatformSessionsTableProps {
  data: PlatformSessionsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

export function PlatformSessionsTable({ data, isLoading, isError }: PlatformSessionsTableProps) {
  if (isError) {
    return <Alert severity="error">Failed to load active sessions. The API may be unavailable or you lack permission.</Alert>;
  }

  const tenants = data?.tenants ?? [];
  const totalUsers = data?.total_active_users ?? 0;
  const totalSessions = data?.total_sessions ?? 0;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Platform active sessions">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 48 }} />
            <TableCell>Tenant</TableCell>
            <TableCell align="right">Active Users</TableCell>
            <TableCell align="right">Sessions</TableCell>
            <TableCell>Last Activity</TableCell>
          </TableRow>
        </TableHead>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <TableBody>
              {tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      No active sessions across any tenant.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map(tenant => <TenantRow key={tenant.tenant_id} tenant={tenant} />)
              )}
            </TableBody>

            {tenants.length > 0 && (
              <TableFooter>
                <TableRow sx={{ '& td': { fontWeight: 600 } }}>
                  <TableCell />
                  <TableCell>Totals</TableCell>
                  <TableCell align="right">{totalUsers}</TableCell>
                  <TableCell align="right">{totalSessions}</TableCell>
                  <TableCell />
                </TableRow>
              </TableFooter>
            )}
          </>
        )}
      </Table>
    </TableContainer>
  );
}
