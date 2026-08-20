# P1 Candidate Delivery Configuration

Shipped in commit `b48923e` on branch `recruitment_board`.

This document covers all form fields, validation ranges, API mapping, and UX behavior for the Candidate Delivery configuration section in the backoffice tenant edit page (`/tenants/[id]`).

---

## Section location

The section is rendered by `CandidateDeliverySection` and appears in the tenant edit/detail page after the existing config sections. It follows the same drawer-based inline-edit pattern used by all other tenant edit sections.

---

## Form fields and validation

### Shortlist and limits

| Field | UI label | Type | Validation | Default |
|-------|----------|------|-----------|---------|
| Shortlist default size | "Shortlist default size" | integer | 1 – 20 | — |
| Candidate limit per job | "Candidate limit per job" | integer | >= 1 | — |
| Delivery review threshold | "Delivery review threshold (%)" | number | 0 – 100 | — |

### Freshness bonus

| Field | UI label | Type | Validation | Notes |
|-------|----------|------|-----------|-------|
| Freshness bonus enabled | "Enable freshness bonus" | boolean toggle | — | Enables the bonus sub-fields |
| Bonus points | "Bonus points" | integer | 0 – 20 | Shown only when enabled |
| Window days | "Window (days)" | integer | 30 – 365 | Shown only when enabled |

When the toggle is off, `freshness_bonus_points` and `freshness_window_days` are not submitted (or submitted as `null` depending on backend contract).

### Matching cadence

| Field | UI label | Type | Options | Notes |
|-------|----------|------|---------|-------|
| Matching cadence hours | "Matching cadence" | select | 0 (disabled), 6, 12, 24 | 0 disables scheduled matching |

### Report delivery

| Field | UI label | Type | Validation | Notes |
|-------|----------|------|-----------|-------|
| Report delivery enabled | "Enable report delivery" | boolean toggle | — | Enables the report sub-fields |
| Report count | "Reports per period" | integer | >= 1 | Shown only when enabled |
| Period days | "Period (days)" | integer | >= 1 | Shown only when enabled |
| Notification recipients | "Notification recipients" | chip list (email input) | valid email format per entry | See chip list behavior below |

---

## Notification recipients chip list

- Users type an email address and press Enter or comma to add it as a chip.
- Each chip displays the email with a remove (×) button.
- Validation runs on each entry: invalid email format shows an error state on input; the invalid address is not added to the list.
- The submitted value is a `string[]` array of email addresses.
- No deduplication is enforced client-side; the backend is the authority on duplicates.

---

## API mapping

All delivery config fields map to two sub-objects on the Account resource:

### `match_config` (MatchWeightConfig)

| Form field | API field |
|-----------|-----------|
| Shortlist default size | `shortlist_size` |
| Candidate limit per job | `candidate_limit` |
| Delivery review threshold | `review_threshold` |
| Freshness bonus enabled | `freshness_bonus_enabled` |
| Freshness bonus points | `freshness_bonus_points` |
| Freshness window days | `freshness_window_days` |
| Matching cadence hours | `cadence_hours` |

### `report_config` (ReportConfig)

| Form field | API field |
|-----------|-----------|
| Report delivery enabled | `enabled` |
| Report count | `report_count` |
| Report period days | `period_days` |
| Notification recipients | `recipients` |

Endpoint: `PATCH /admin/accounts/{id}` — only the changed sub-object is submitted per section save.

---

## TypeScript interfaces

- `MatchConfig` — `src/features/tenants/interfaces/match-config.interface.ts`
- `ReportConfig` — `src/features/tenants/interfaces/report-config.interface.ts`

## Enum

`CANDIDATE_DELIVERY` added to the tenant section titles enum to identify this section in navigation and section-scoped edit logic.

---

## Components

| Component | Path | Role |
|-----------|------|------|
| `CandidateDeliverySection` | `src/features/tenants/components/CandidateDeliverySection.tsx` | Wires read/edit; opens drawer |
| `CandidateDeliveryView` | `src/features/tenants/components/CandidateDeliveryView.tsx` | Read-only display of all fields |
| `CandidateDeliveryForm` | `src/features/tenants/components/CandidateDeliveryForm.tsx` | Editable form with validation |
