'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add, Edit, TrashCan, Close } from '@carbon/icons-react';
import { TemplateSkill, ScoringTemplate } from '@/features/tenants/interfaces/scoring-template.interface';
import {
  useGetScoringTemplates,
  useCreateScoringTemplate,
  useUpdateScoringTemplate,
  useDeleteScoringTemplate,
} from '@/features/tenants/hooks/useScoringTemplates';

interface SkillEditorRow {
  skill_name: string;
  weight: number;
  category: 'hard' | 'soft';
  is_mandatory: boolean;
}

const EMPTY_SKILL: SkillEditorRow = { skill_name: '', weight: 0, category: 'hard', is_mandatory: true };

function TemplateSkillEditor({ skills, onChange }: { skills: SkillEditorRow[]; onChange: (s: SkillEditorRow[]) => void }) {
  const handleFieldChange = useCallback(
    (index: number, field: keyof SkillEditorRow, value: string | number | boolean) => {
      const updated = skills.map((s, i) => (i === index ? { ...s, [field]: value } : s));
      onChange(updated);
    },
    [skills, onChange],
  );

  const handleAdd = useCallback(() => onChange([...skills, { ...EMPTY_SKILL }]), [skills, onChange]);
  const handleRemove = useCallback((index: number) => onChange(skills.filter((_, i) => i !== index)), [skills, onChange]);

  const weightSum = skills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);

  return (
    <Box>
      <TableContainer>
        <Table size="small" aria-label="Template skills editor" sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col />
            <col style={{ width: 90 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 40 }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Skill Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Weight</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Mandatory</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {skills.map((skill, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={skill.skill_name}
                    onChange={(e) => handleFieldChange(index, 'skill_name', e.target.value)}
                    size="small"
                    fullWidth
                    placeholder="e.g. accounting"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={skill.weight}
                    onChange={(e) => handleFieldChange(index, 'weight', Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                    size="small"
                    type="number"
                    inputProps={{ min: 0, max: 100 }}
                    sx={{ width: 80 }}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={skill.category}
                    onChange={(e) => handleFieldChange(index, 'category', e.target.value)}
                    size="small"
                    select
                    sx={{ width: 90 }}
                  >
                    <MenuItem value="hard">Hard</MenuItem>
                    <MenuItem value="soft">Soft</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={skill.is_mandatory}
                    onChange={(e) => handleFieldChange(index, 'is_mandatory', e.target.checked)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleRemove(index)} aria-label="Remove skill">
                    <Close size={14} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
        <Button size="small" startIcon={<Add size={14} />} onClick={handleAdd} sx={{ textTransform: 'none' }}>
          Add Skill
        </Button>
        <Typography variant="caption" color={weightSum === 100 ? 'success.main' : 'warning.main'}>
          Weight sum: {weightSum}
          {weightSum !== 100 ? ' (must be 100)' : ''}
        </Typography>
      </Stack>
    </Box>
  );
}

interface ScoringTemplatesPanelProps {
  tenantId: string;
}

export const ScoringTemplatesPanel = ({ tenantId }: ScoringTemplatesPanelProps) => {
  const { data: templatesData, isLoading, isError, refetch } = useGetScoringTemplates(tenantId);
  const createMutation = useCreateScoringTemplate(tenantId);
  const updateMutation = useUpdateScoringTemplate(tenantId);
  const deleteMutation = useDeleteScoringTemplate(tenantId);

  const templates = useMemo(() => templatesData?.templates ?? [], [templatesData]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ScoringTemplate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ severity: 'success' | 'error'; message: string } | null>(null);

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSkills, setFormSkills] = useState<SkillEditorRow[]>([{ ...EMPTY_SKILL }]);

  useEffect(() => {
    if (editingTemplate) {
      setFormName(editingTemplate.name);
      setFormDescription(editingTemplate.description);
      setFormSkills(
        editingTemplate.skills.map((s) => ({
          skill_name: s.skill_name,
          weight: s.weight,
          category: s.category,
          is_mandatory: s.is_mandatory,
        })),
      );
    }
  }, [editingTemplate]);

  const handleOpenCreate = useCallback(() => {
    setEditingTemplate(null);
    setFormName('');
    setFormDescription('');
    setFormSkills([{ ...EMPTY_SKILL }]);
    setDialogOpen(true);
  }, []);

  const handleOpenEdit = useCallback((template: ScoringTemplate) => {
    setEditingTemplate(template);
    setDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setDialogOpen(false);
    setEditingTemplate(null);
  }, []);

  const weightSum = formSkills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
  const validSkills = formSkills.filter((s) => s.skill_name.trim());
  const canSubmit = formName.trim() && validSkills.length > 0 && weightSum === 100;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const cleanSkills: TemplateSkill[] = validSkills.map((s) => ({
      skill_name: s.skill_name.trim().toLowerCase(),
      weight: s.weight,
      category: s.category,
      is_mandatory: s.is_mandatory,
    }));

    try {
      if (editingTemplate) {
        await updateMutation.mutateAsync({
          templateId: editingTemplate.template_id,
          body: {
            name: formName.trim(),
            description: formDescription.trim(),
            skills: cleanSkills,
            expected_version: editingTemplate.version,
          },
        });
        setFeedback({ severity: 'success', message: `Template "${formName}" updated.` });
      } else {
        await createMutation.mutateAsync({
          name: formName.trim(),
          description: formDescription.trim(),
          skills: cleanSkills,
        });
        setFeedback({ severity: 'success', message: `Template "${formName}" created.` });
      }
      handleClose();
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number } };
      if (apiErr.response?.status === 409) {
        setFeedback({ severity: 'error', message: 'Version conflict. Please reload and try again.' });
      } else {
        setFeedback({ severity: 'error', message: `Failed to ${editingTemplate ? 'update' : 'create'} template.` });
      }
    }
  }, [canSubmit, validSkills, editingTemplate, formName, formDescription, createMutation, updateMutation, handleClose]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setFeedback({ severity: 'success', message: 'Template deleted.' });
    } catch {
      setFeedback({ severity: 'error', message: 'Failed to delete template.' });
    }
    setDeleteConfirmId(null);
  }, [deleteConfirmId, deleteMutation]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        Failed to load scoring templates.{' '}
        <Button size="small" onClick={() => refetch()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      {feedback && (
        <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ mb: 2 }}>
          {feedback.message}
        </Alert>
      )}

      <TableContainer>
        <Table size="small" aria-label="Scoring templates" sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '30%' }} />
            <col style={{ width: 80 }} />
            <col style={{ width: '50%' }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Skills</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No templates configured. Create one to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {templates.map((tmpl) => (
              <TableRow key={tmpl.template_id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{tmpl.name}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">{tmpl.skills.length}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {tmpl.description}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => handleOpenEdit(tmpl)} aria-label={`Edit ${tmpl.name}`}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setDeleteConfirmId(tmpl.template_id)} aria-label={`Delete ${tmpl.name}`}>
                    <TrashCan size={16} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" size="small" startIcon={<Add size={16} />} onClick={handleOpenCreate} sx={{ textTransform: 'none' }}>
          New Template
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingTemplate ? `Edit "${editingTemplate.name}"` : 'New Scoring Template'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Template name" value={formName} onChange={(e) => setFormName(e.target.value)} size="small" fullWidth autoFocus />
            <TextField label="Description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} size="small" fullWidth multiline rows={2} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Skills (weights must sum to 100)
            </Typography>
            <TemplateSkillEditor skills={formSkills} onChange={setFormSkills} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!canSubmit || createMutation.isPending || updateMutation.isPending}
            sx={{ textTransform: 'none' }}
          >
            {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this template? Jobs that already applied it will keep their effective skills.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteMutation.isPending} sx={{ textTransform: 'none' }}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
