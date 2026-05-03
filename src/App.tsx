import { FormEvent, Fragment, MouseEvent, useState } from 'react';
import logo from '../logo.png';
import {
  classifySegment,
  createSurveySubmission,
  filterOptions,
  seededFeedback,
} from './data';
import type { FeedbackItem, ReplyTemplateKey, Segment } from './types';

type RespondedFeedback = FeedbackItem & {
  score: number;
};

type UserLocationOption = 'all' | (typeof filterOptions.locations)[number];

type UserRecord = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  defaultLocation: UserLocationOption;
  isAdmin: boolean;
};

type ReplyDraft = {
  templateKey: ReplyTemplateKey;
  staffComments: string;
};

const seededUsers: UserRecord[] = [
  {
    id: 1,
    username: 'admin.atomic',
    firstName: 'Olivia',
    lastName: 'Wilson',
    email: 'olivia.wilson@myrentalcar.co.nz',
    defaultLocation: 'all',
    isAdmin: true,
  },
  {
    id: 2,
    username: 'akl.manager',
    firstName: 'Jack',
    lastName: 'Taylor',
    email: 'jack.taylor@myrentalcar.co.nz',
    defaultLocation: 'Auckland',
    isAdmin: false,
  },
  {
    id: 3,
    username: 'qt.branchlead',
    firstName: 'Amelia',
    lastName: 'Fraser',
    email: 'amelia.fraser@myrentalcar.co.nz',
    defaultLocation: 'Queenstown',
    isAdmin: false,
  },
];

const defaultSurveyTemplate = `<!doctype html>
<html>
  <body style="margin:0; padding:24px; background:#eef4fb; font-family:Arial, Helvetica, sans-serif; color:#0d1b2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #d8e4f2;">
      <tr>
        <td style="padding:32px 36px; background:linear-gradient(135deg, #2F8BFF, #1758D1); color:#ffffff;">
          <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; opacity:0.9;">Atomic Rentals</div>
          <h1 style="margin:12px 0 0; font-size:30px; line-height:1.1;">We'd like your feedback</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
            Thanks for choosing Atomic Rentals for your recent trip from {{pickup_location}} to {{dropoff_location}}.
          </p>
          <p style="margin:0 0 28px; font-size:16px; line-height:1.6;">
            On a scale from 1-10, how likely are you to recommend Atomic Rentals to a friend or family member?
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 20px;">
            <tr>
              <td align="center" style="padding:0;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=1" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">1</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=2" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">2</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=3" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">3</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=4" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">4</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=5" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">5</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=6" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">6</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=7" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">7</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=8" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">8</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=9" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#f0f5fb; color:#1758D1; text-decoration:none; text-align:center; font-weight:700;">9</a></td>
                    <td style="padding:0 4px 8px;"><a href="{{surveylink}}&?score=10" style="display:inline-block; min-width:38px; padding:12px 0; border-radius:10px; background:#2F8BFF; color:#ffffff; text-decoration:none; text-align:center; font-weight:700;">10</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <div style="display:flex; justify-content:space-between; margin:0 0 24px; color:#46566f; font-size:13px; line-height:1.5;">
            <span>Not likely</span>
            <span>Extremely likely</span>
          </div>
          <div style="padding-top:24px; border-top:1px solid #e5edf6; color:#46566f; font-size:14px; line-height:1.7;">
            You can also use this direct survey link:<br />
            <span style="color:#1758D1;">{{surveylink}}</span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 36px; background:#f8fbff; border-top:1px solid #e5edf6; color:#46566f; font-size:13px; line-height:1.6;">
          Atomic Rentals<br />
          Thanks again for travelling with us.
        </td>
      </tr>
    </table>
  </body>
</html>`;

const defaultReplyTemplates: Record<ReplyTemplateKey, string> = {
  promoter: `<!doctype html>
<html>
  <body style="margin:0; padding:24px; background:#eef4fb; font-family:Arial, Helvetica, sans-serif; color:#0d1b2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #d8e4f2;">
      <tr>
        <td style="padding:28px 36px; background:linear-gradient(135deg, #15935f, #0f7a54); color:#ffffff;">
          <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; opacity:0.9;">Atomic Rentals</div>
          <h1 style="margin:12px 0 0; font-size:28px; line-height:1.1;">Thank you for the great feedback</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
            Thank you for rating Atomic Rentals so highly. We are pleased to hear your rental experience met expectations.
          </p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#46566f;">
            {{staffcomments}}
          </p>
          <p style="margin:0; font-size:15px; line-height:1.6; color:#46566f;">
            We appreciate your support and hope to welcome you back again soon.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  passive: `<!doctype html>
<html>
  <body style="margin:0; padding:24px; background:#eef4fb; font-family:Arial, Helvetica, sans-serif; color:#0d1b2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #d8e4f2;">
      <tr>
        <td style="padding:28px 36px; background:linear-gradient(135deg, #ffb648, #ef9e29); color:#ffffff;">
          <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; opacity:0.9;">Atomic Rentals</div>
          <h1 style="margin:12px 0 0; font-size:28px; line-height:1.1;">Thank you for your feedback</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
            Thank you for sharing your recent experience with Atomic Rentals. We appreciate you taking the time to let us know where we can improve.
          </p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#46566f;">
            {{staffcomments}}
          </p>
          <p style="margin:0; font-size:15px; line-height:1.6; color:#46566f;">
            Your feedback helps us improve service across our branches.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
  detractor: `<!doctype html>
<html>
  <body style="margin:0; padding:24px; background:#eef4fb; font-family:Arial, Helvetica, sans-serif; color:#0d1b2a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #d8e4f2;">
      <tr>
        <td style="padding:28px 36px; background:linear-gradient(135deg, #d64545, #b62d2d); color:#ffffff;">
          <div style="font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:700; opacity:0.9;">Atomic Rentals</div>
          <h1 style="margin:12px 0 0; font-size:28px; line-height:1.1;">We are sorry your experience fell short</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:32px 36px;">
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">Hi {{first_name}},</p>
          <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
            Thank you for your honest feedback. We are sorry that your recent Atomic Rentals experience did not meet expectations.
          </p>
          <p style="margin:0 0 16px; font-size:15px; line-height:1.7; color:#46566f;">
            {{staffcomments}}
          </p>
          <p style="margin:0; font-size:15px; line-height:1.6; color:#46566f;">
            We take this seriously and appreciate the opportunity to follow up.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`,
};

type Filters = {
  pickupLocation: string;
  dropOffLocation: string;
  bookingSource: string;
  vehicle: string;
  segment: Segment;
};

const defaultFilters: Filters = {
  pickupLocation: 'all',
  dropOffLocation: 'all',
  bookingSource: 'all',
  vehicle: 'all',
  segment: 'all',
};

type Tab = 'overview' | 'data' | 'settings' | 'users';
type SettingsSubTab = 'survey' | 'reply';

type SurveyPreviewState = {
  comments: string;
  score: number | null;
  submittedEntryId: number | null;
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [feedbackEntries, setFeedbackEntries] = useState(seededFeedback);
  const [users, setUsers] = useState<UserRecord[]>(seededUsers);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userActionMessage, setUserActionMessage] = useState('');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [expandedFeedbackId, setExpandedFeedbackId] = useState<number | null>(null);
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('survey');
  const [surveyTemplateHtml, setSurveyTemplateHtml] = useState(defaultSurveyTemplate);
  const [replyTemplates, setReplyTemplates] =
    useState<Record<ReplyTemplateKey, string>>(defaultReplyTemplates);
  const [selectedReplyTemplate, setSelectedReplyTemplate] =
    useState<ReplyTemplateKey>('promoter');
  const [replyDrafts, setReplyDrafts] = useState<Record<number, ReplyDraft>>({});
  const [surveyPreview, setSurveyPreview] = useState<SurveyPreviewState | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    defaultLocation: 'all' as UserLocationOption,
    isAdmin: false,
  });
  const [draftUsername, setDraftUsername] = useState('');
  const [draftPassword, setDraftPassword] = useState('');
  const [username, setUsername] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return window.localStorage.getItem('nps-demo-user') ?? '';
  });

  const filteredFeedback = feedbackEntries.filter((entry) => {
    return (
      (filters.pickupLocation === 'all' || entry.pickupLocation === filters.pickupLocation) &&
      (filters.dropOffLocation === 'all' || entry.dropOffLocation === filters.dropOffLocation) &&
      (filters.bookingSource === 'all' || entry.bookingSource === filters.bookingSource) &&
      (filters.vehicle === 'all' || entry.vehicle === filters.vehicle) &&
      (filters.segment === 'all' || classifySegment(entry.score) === filters.segment)
    );
  });
  const respondedFeedback = filteredFeedback.filter(hasResponse);

  const stats = calculateStats(respondedFeedback);
  const topPickupLocation = findTopValue(filteredFeedback, (entry) => entry.pickupLocation);
  const topBookingSource = findTopValue(filteredFeedback, (entry) => entry.bookingSource);
  const topVehicle = findTopValue(filteredFeedback, (entry) => entry.vehicle);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextUser = draftUsername.trim() || 'Guest User';
    window.localStorage.setItem('nps-demo-user', nextUser);
    setUsername(nextUser);
    setDraftPassword('');
  };

  const handleLogout = () => {
    window.localStorage.removeItem('nps-demo-user');
    setUsername('');
    setDraftUsername('');
    setDraftPassword('');
  };

  const openSurveyPreview = (score: number | null) => {
    setSurveyPreview({
      comments: '',
      score,
      submittedEntryId: null,
    });
  };

  const closeSurveyPreview = () => {
    setSurveyPreview(null);
  };

  const handleTemplatePreviewClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const link = target.closest('a');

    if (!link) {
      return;
    }

    const href = link.getAttribute('href') ?? '';

    if (!href.includes('{{surveylink}}')) {
      return;
    }

    event.preventDefault();

    const scoreMatch = href.match(/score=(\d+)/);
    openSurveyPreview(scoreMatch ? Number(scoreMatch[1]) : null);
  };

  const handleSurveySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!surveyPreview || surveyPreview.score === null) {
      return;
    }

    const submittedEntry = createSurveySubmission(
      feedbackEntries,
      surveyPreview.score,
      surveyPreview.comments,
    );

    setFeedbackEntries((currentEntries) => [submittedEntry, ...currentEntries]);
    setExpandedFeedbackId(submittedEntry.id);
    setSurveyPreview({
      comments: surveyPreview.comments,
      score: surveyPreview.score,
      submittedEntryId: submittedEntry.id,
    });
  };

  const handleAddUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingUserId === null) {
      const nextUser: UserRecord = {
        id: users.length === 0 ? 1 : Math.max(...users.map((user) => user.id)) + 1,
        username: userForm.username.trim(),
        firstName: userForm.firstName.trim(),
        lastName: userForm.lastName.trim(),
        email: userForm.email.trim(),
        defaultLocation: userForm.defaultLocation,
        isAdmin: userForm.isAdmin,
      };

      setUsers((currentUsers) => [nextUser, ...currentUsers]);
    } else {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUserId
            ? {
                ...user,
                username: userForm.username.trim(),
                firstName: userForm.firstName.trim(),
                lastName: userForm.lastName.trim(),
                email: userForm.email.trim(),
                defaultLocation: userForm.defaultLocation,
                isAdmin: userForm.isAdmin,
              }
            : user,
        ),
      );
    }

    resetUserForm();
  };

  const handleEditUser = (user: UserRecord) => {
    setEditingUserId(user.id);
    setUserForm({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      defaultLocation: user.defaultLocation,
      isAdmin: user.isAdmin,
    });
  };

  const resetUserForm = () => {
    setEditingUserId(null);
    setUserForm({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      defaultLocation: 'all',
      isAdmin: false,
    });
  };

  const handleResetPassword = (user: UserRecord) => {
    setUserActionMessage(`Password reset link sent to ${user.email}.`);
  };

  const handleOpenSubmittedFeedback = () => {
    closeSurveyPreview();
    setActiveTab('data');
    setFilters(defaultFilters);
  };

  const handleExportFeedbackCsv = () => {
    const columns = [
      'Pickup Location',
      'Drop Off Location',
      'Pickup Date',
      'Drop Off Date',
      'Booking Source',
      'Vehicle',
      'First Name',
      'Last Name',
      'Email',
      'Score',
      'Comments',
      'Status',
    ];

    const csvRows = filteredFeedback.map((entry) => [
      entry.pickupLocation,
      entry.dropOffLocation,
      entry.pickupDate,
      entry.dropOffDate,
      entry.bookingSource,
      entry.vehicle,
      entry.firstName,
      entry.lastName,
      entry.email,
      entry.score === null ? '' : String(entry.score),
      entry.comments ?? '',
      entry.score === null ? 'Pending' : 'Completed',
    ]);

    const csvContent = [columns, ...csvRows]
      .map((row) => row.map(escapeCsvValue).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'feedback-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getReplyDraft = (entry: FeedbackItem): ReplyDraft => {
    const existingDraft = replyDrafts[entry.id];

    if (existingDraft) {
      return existingDraft;
    }

    return {
      templateKey: getSuggestedReplyTemplate(entry.score),
      staffComments: '',
    };
  };

  const updateReplyDraft = (
    entryId: number,
    updates: Partial<ReplyDraft>,
    entry: FeedbackItem,
  ) => {
    setReplyDrafts((currentDrafts) => {
      const currentDraft = currentDrafts[entryId] ?? getReplyDraft(entry);

      return {
        ...currentDrafts,
        [entryId]: {
          ...currentDraft,
          ...updates,
        },
      };
    });
  };

  const handleSendReply = (entry: FeedbackItem) => {
    if (entry.score === null || entry.feedbackReply) {
      return;
    }

    const draft = getReplyDraft(entry);
    const renderedHtml = renderReplyTemplate(
      replyTemplates[draft.templateKey],
      entry,
      draft.staffComments,
    );
    const sentAt = new Date().toLocaleString('en-NZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    setFeedbackEntries((currentEntries) =>
      currentEntries.map((currentEntry) =>
        currentEntry.id === entry.id
          ? {
              ...currentEntry,
              feedbackReply: {
                templateKey: draft.templateKey,
                staffComments: draft.staffComments.trim(),
                renderedHtml,
                sentAt,
              },
            }
          : currentEntry,
      ),
    );
  };

  if (!username) {
    return (
      <main className="login-shell">
        <section className="login-card">
          <div className="login-showcase">
            <div className="login-brand">
              <img src={logo} alt="Atomic Rentals" className="login-logo" />
              <div>
                <p className="eyebrow">Portfolio Demo</p>
                <h1>Atomic Rentals NPS Console</h1>
              </div>
            </div>
          </div>

          <div className="login-panel">
            <div className="login-panel-header">
              <p className="eyebrow">Sign In</p>
              <h2>Access the dashboard</h2>
            </div>

            <div className="login-note">
              Any username and password combination will work for this demo.
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <label>
                Username
                <input
                  type="text"
                  value={draftUsername}
                  onChange={(event) => setDraftUsername(event.target.value)}
                  placeholder="e.g. admin"
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={draftPassword}
                  onChange={(event) => setDraftPassword(event.target.value)}
                  placeholder="Any password"
                />
              </label>

              <button type="submit">Enter dashboard</button>
            </form>

            <p className="login-form-footnote">
              This login is intentionally non-secure and exists only for portfolio presentation.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (surveyPreview) {
    const hasSubmitted = surveyPreview.submittedEntryId !== null;

    return (
      <main className="survey-shell">
        <section className="survey-card">
          <div className="survey-brand">
            <img src={logo} alt="Atomic Rentals" className="survey-logo" />
            <p className="eyebrow">Customer Survey Preview</p>
          </div>

          {hasSubmitted ? (
            <div className="survey-success">
              <h1>Thanks for your feedback</h1>
              <p>
                This response has been submitted into the demo system and can now be reviewed
                from the feedback data tab.
              </p>
              <div className="survey-actions">
                <button type="button" className="survey-primary-button" onClick={handleOpenSubmittedFeedback}>
                  View submitted feedback
                </button>
                <button type="button" className="ghost-button" onClick={closeSurveyPreview}>
                  Close preview
                </button>
              </div>
            </div>
          ) : (
            <form className="survey-form" onSubmit={handleSurveySubmit}>
              <div className="survey-header">
                <h1>On a scale from 1-10, how likely are you to recommend Atomic Rentals to a friend or family member?</h1>
                <p>
                  Choose a score below and optionally leave a comment to simulate a customer
                  survey response.
                </p>
              </div>

              <div className="survey-score-grid">
                {Array.from({ length: 10 }, (_, index) => {
                  const score = index + 1;
                  const isActive = surveyPreview.score === score;

                  return (
                    <button
                      key={score}
                      type="button"
                      className={isActive ? 'survey-score-button is-active' : 'survey-score-button'}
                      onClick={() =>
                        setSurveyPreview((currentPreview) =>
                          currentPreview
                            ? { ...currentPreview, score }
                            : currentPreview,
                        )
                      }
                    >
                      {score}
                    </button>
                  );
                })}
              </div>

              <div className="survey-score-labels">
                <span>Not likely</span>
                <span>Extremely likely</span>
              </div>

              <label className="survey-comments">
                <span>Comments</span>
                <textarea
                  value={surveyPreview.comments}
                  onChange={(event) =>
                    setSurveyPreview((currentPreview) =>
                      currentPreview
                        ? { ...currentPreview, comments: event.target.value }
                        : currentPreview,
                    )
                  }
                  placeholder="Tell us more about your experience"
                />
              </label>

              <div className="survey-actions">
                <button
                  type="submit"
                  className="survey-primary-button"
                  disabled={surveyPreview.score === null}
                >
                  Submit feedback
                </button>
                <button type="button" className="ghost-button" onClick={closeSurveyPreview}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="ambient-orb ambient-orb-left" />
      <div className="ambient-orb ambient-orb-right" />

      <section className="dashboard">
        <header className="topbar">
          <div className="brand-lockup">
            <img src={logo} alt="Atomic Rentals" className="topbar-logo" />
            <div>
              <p className="eyebrow">Net Promoter System</p>
              <h1>Customer Sentiment Dashboard</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="user-chip">
              <span>Signed in as</span>
              <strong>{username}</strong>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </header>

        <section className="hero-card">
          <div>
            <p className="eyebrow">Current snapshot</p>
            <h2>{stats.npsScore >= 0 ? `+${stats.npsScore}` : stats.npsScore} NPS</h2>
              <p className="hero-copy">
                {stats.totalResponses === 0
                  ? 'No completed survey responses match the current filters.'
                  : `Based on ${stats.totalResponses} completed survey responses across the rental network.`}
              </p>
            </div>

          <div className="hero-breakdown">
            <StatPill label="Promoters" value={stats.promoters} tone="positive" />
            <StatPill label="Passives" value={stats.passives} tone="neutral" />
            <StatPill label="Detractors" value={stats.detractors} tone="negative" />
          </div>
        </section>

        <section className="filters-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Filters</p>
              <h3>Slice the NPS view</h3>
            </div>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setFilters(defaultFilters)}
            >
              Reset filters
            </button>
          </div>

          <div className="filters-grid">
            <SelectField
              label="Pickup location"
              value={filters.pickupLocation}
              options={['all', ...filterOptions.locations]}
              onChange={(value) => setFilters({ ...filters, pickupLocation: value })}
            />
            <SelectField
              label="Drop off location"
              value={filters.dropOffLocation}
              options={['all', ...filterOptions.locations]}
              onChange={(value) => setFilters({ ...filters, dropOffLocation: value })}
            />
            <SelectField
              label="Booking source"
              value={filters.bookingSource}
              options={['all', ...filterOptions.bookingSources]}
              onChange={(value) => setFilters({ ...filters, bookingSource: value })}
            />
            <SelectField
              label="Vehicle"
              value={filters.vehicle}
              options={['all', ...filterOptions.vehicles]}
              onChange={(value) => setFilters({ ...filters, vehicle: value })}
            />
            <SelectField
              label="NPS segment"
              value={filters.segment}
              options={['all', 'promoter', 'passive', 'detractor']}
              onChange={(value) => setFilters({ ...filters, segment: value as Segment })}
            />
          </div>
        </section>

        <nav className="tab-row" aria-label="Dashboard sections">
          <button
            type="button"
            className={activeTab === 'overview' ? 'tab is-active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={activeTab === 'data' ? 'tab is-active' : 'tab'}
            onClick={() => setActiveTab('data')}
          >
            Feedback Data
          </button>
          <button
            type="button"
            className={activeTab === 'settings' ? 'tab is-active' : 'tab'}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button
            type="button"
            className={activeTab === 'users' ? 'tab is-active' : 'tab'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </nav>

        {activeTab === 'overview' ? (
          <section className="overview-grid">
            <article className="metric-card">
              <p>Total responses</p>
              <strong>{stats.totalResponses}</strong>
              <span>Seeded customer feedback records in the current view.</span>
            </article>
            <article className="metric-card">
              <p>Average score</p>
              <strong>{stats.averageScore.toFixed(1)}</strong>
              <span>Mean satisfaction score across filtered rentals.</span>
            </article>
            <article className="metric-card">
              <p>Top pickup location</p>
              <strong>{topPickupLocation}</strong>
              <span>Most common pickup branch in the filtered set.</span>
            </article>
            <article className="metric-card">
              <p>Top booking source</p>
              <strong>{topBookingSource}</strong>
              <span>Primary acquisition channel for these responses.</span>
            </article>
            <article className="insight-card insight-card-large">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Distribution</p>
                  <h3>Score mix</h3>
                </div>
              </div>

              <div className="distribution-list">
                <DistributionBar
                  label="Promoters"
                  count={stats.promoters}
                  total={stats.totalResponses}
                  tone="positive"
                />
                <DistributionBar
                  label="Passives"
                  count={stats.passives}
                  total={stats.totalResponses}
                  tone="neutral"
                />
                <DistributionBar
                  label="Detractors"
                  count={stats.detractors}
                  total={stats.totalResponses}
                  tone="negative"
                />
              </div>
            </article>
            <article className="insight-card">
              <p className="eyebrow">Fleet pulse</p>
              <h3>{topVehicle}</h3>
              <p>
                Most referenced vehicle in the filtered data, useful for comparing experience
                across fleet groups.
              </p>
            </article>
          </section>
        ) : activeTab === 'data' ? (
          <section className="table-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Seed data</p>
                <h3>
                  Showing {filteredFeedback.length} of {feedbackEntries.length} survey records
                </h3>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={handleExportFeedbackCsv}
              >
                Export CSV
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Source</th>
                    <th>Score</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeedback.map((entry) => {
                    const isExpanded = expandedFeedbackId === entry.id;
                    const replyDraft = getReplyDraft(entry);

                    return (
                      <Fragment key={entry.id}>
                        <tr>
                          <td>
                            <div className="location-cell">
                              <strong>{entry.pickupLocation}</strong>
                              <span>to {entry.dropOffLocation}</span>
                            </div>
                          </td>
                          <td>{entry.firstName}</td>
                          <td>{entry.lastName}</td>
                          <td>{entry.bookingSource}</td>
                          <td>
                            {entry.score === null ? (
                              <span className="score-badge pending">Pending</span>
                            ) : (
                              <span className={`score-badge ${classifySegment(entry.score)}`}>
                                {entry.score}
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="table-action"
                              aria-expanded={isExpanded}
                              onClick={() =>
                                setExpandedFeedbackId(isExpanded ? null : entry.id)
                              }
                            >
                              {isExpanded ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                        {isExpanded ? (
                          <tr className="detail-row">
                            <td colSpan={6}>
                              <div className="detail-panel">
                                <div className="detail-grid">
                                  <DetailItem label="Pickup location" value={entry.pickupLocation} />
                                  <DetailItem label="Drop off location" value={entry.dropOffLocation} />
                                  <DetailItem label="Pickup date" value={entry.pickupDate} />
                                  <DetailItem label="Drop off date" value={entry.dropOffDate} />
                                  <DetailItem label="Booking source" value={entry.bookingSource} />
                                  <DetailItem label="Vehicle" value={entry.vehicle} />
                                  <DetailItem label="First name" value={entry.firstName} />
                                  <DetailItem label="Last name" value={entry.lastName} />
                                  <DetailItem label="Email" value={entry.email} />
                                  <DetailItem
                                    label="Score"
                                    value={entry.score === null ? 'Not yet received' : String(entry.score)}
                                  />
                                </div>
                                <DetailItem
                                  label="Comments"
                                  value={formatComment(entry.comments)}
                                  className="detail-comments"
                                />

                                {entry.score !== null ? (
                                  entry.feedbackReply ? (
                                    <div className="reply-section">
                                      <div className="reply-section-header">
                                        <div>
                                          <p className="eyebrow">Reply Sent</p>
                                          <h4>{formatReplyTemplateLabel(entry.feedbackReply.templateKey)}</h4>
                                        </div>
                                        <span>{entry.feedbackReply.sentAt}</span>
                                      </div>
                                      <DetailItem
                                        label="Staff comments"
                                        value={entry.feedbackReply.staffComments}
                                      />
                                      <div className="reply-preview-shell">
                                        <div
                                          className="reply-preview"
                                          dangerouslySetInnerHTML={{
                                            __html: entry.feedbackReply.renderedHtml,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="reply-section">
                                      <div className="reply-section-header">
                                        <div>
                                          <p className="eyebrow">Survey Reply</p>
                                          <h4>Send follow-up response</h4>
                                        </div>
                                      </div>

                                      <div className="reply-form-grid">
                                        <label className="reply-field">
                                          <span>Template</span>
                                          <select
                                            value={replyDraft.templateKey}
                                            onChange={(event) =>
                                              updateReplyDraft(
                                                entry.id,
                                                {
                                                  templateKey: event.target
                                                    .value as ReplyTemplateKey,
                                                },
                                                entry,
                                              )
                                            }
                                          >
                                            <option value="promoter">Promoter Reply</option>
                                            <option value="passive">Passive Reply</option>
                                            <option value="detractor">Detractor Reply</option>
                                          </select>
                                        </label>
                                      </div>

                                      <label className="reply-field">
                                        <span>Staff comments</span>
                                        <textarea
                                          value={replyDraft.staffComments}
                                          onChange={(event) =>
                                            updateReplyDraft(
                                              entry.id,
                                              { staffComments: event.target.value },
                                              entry,
                                            )
                                          }
                                          placeholder="Add your response to the customer"
                                        />
                                      </label>

                                      <button
                                        type="button"
                                        className="table-action send-reply-button"
                                        disabled={!replyDraft.staffComments.trim()}
                                        onClick={() => handleSendReply(entry)}
                                      >
                                        Send reply
                                      </button>
                                    </div>
                                  )
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : activeTab === 'settings' ? (
          <section className="settings-card">
            <div className="settings-intro">
              <p>
                Edit the survey request and survey reply templates here using raw HTML and
                review the live formatted output alongside each editor.
              </p>
              <p>
                Click <strong>Survey Preview</strong> to open the simulated customer survey,
                submit feedback, and send that response into the demo system. Completed
                surveys can also receive a one-time reply from the feedback data tab.
              </p>
            </div>

            <div className="settings-subtab-row">
              <button
                type="button"
                className={settingsSubTab === 'survey' ? 'tab is-active' : 'tab'}
                onClick={() => setSettingsSubTab('survey')}
              >
                Email Survey
              </button>
              <button
                type="button"
                className={settingsSubTab === 'reply' ? 'tab is-active' : 'tab'}
                onClick={() => setSettingsSubTab('reply')}
              >
                Survey Reply
              </button>
            </div>

            {settingsSubTab === 'survey' ? (
              <>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Email Templates</p>
                    <h3>Survey Request</h3>
                  </div>
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => openSurveyPreview(null)}
                  >
                    Survey Preview
                  </button>
                </div>

                <div className="template-layout">
                  <article className="template-panel">
                    <div className="template-panel-header">
                      <p className="eyebrow">HTML Editor</p>
                      <span>Template name: Survey Request</span>
                    </div>
                    <textarea
                      className="template-editor"
                      value={surveyTemplateHtml}
                      onChange={(event) => setSurveyTemplateHtml(event.target.value)}
                      spellCheck={false}
                    />
                  </article>

                  <article className="template-panel">
                    <div className="template-panel-header">
                      <p className="eyebrow">Formatted Preview</p>
                      <span>Live render of the current HTML template</span>
                    </div>
                    <div className="template-preview-shell">
                      <div
                        className="template-preview"
                        onClick={handleTemplatePreviewClick}
                        dangerouslySetInnerHTML={{ __html: surveyTemplateHtml }}
                      />
                    </div>
                  </article>
                </div>
              </>
            ) : (
              <>
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Email Templates</p>
                    <h3>Survey Reply</h3>
                  </div>
                </div>

                <div className="reply-template-switcher">
                  <button
                    type="button"
                    className={
                      selectedReplyTemplate === 'promoter' ? 'tab is-active' : 'tab'
                    }
                    onClick={() => setSelectedReplyTemplate('promoter')}
                  >
                    Promoter Reply
                  </button>
                  <button
                    type="button"
                    className={
                      selectedReplyTemplate === 'passive' ? 'tab is-active' : 'tab'
                    }
                    onClick={() => setSelectedReplyTemplate('passive')}
                  >
                    Passive Reply
                  </button>
                  <button
                    type="button"
                    className={
                      selectedReplyTemplate === 'detractor' ? 'tab is-active' : 'tab'
                    }
                    onClick={() => setSelectedReplyTemplate('detractor')}
                  >
                    Detractor Reply
                  </button>
                </div>

                <div className="template-layout">
                  <article className="template-panel">
                    <div className="template-panel-header">
                      <p className="eyebrow">HTML Editor</p>
                      <span>
                        Template name: {formatReplyTemplateLabel(selectedReplyTemplate)}
                      </span>
                    </div>
                    <textarea
                      className="template-editor"
                      value={replyTemplates[selectedReplyTemplate]}
                      onChange={(event) =>
                        setReplyTemplates((currentTemplates) => ({
                          ...currentTemplates,
                          [selectedReplyTemplate]: event.target.value,
                        }))
                      }
                      spellCheck={false}
                    />
                  </article>

                  <article className="template-panel">
                    <div className="template-panel-header">
                      <p className="eyebrow">Formatted Preview</p>
                      <span>
                        Includes the <code>{'{{staffcomments}}'}</code> placeholder area.
                      </span>
                    </div>
                    <div className="template-preview-shell">
                      <div
                        className="template-preview"
                        dangerouslySetInnerHTML={{
                          __html: renderReplyTemplatePreview(
                            replyTemplates[selectedReplyTemplate],
                            selectedReplyTemplate,
                          ),
                        }}
                      />
                    </div>
                  </article>
                </div>
              </>
            )}
          </section>
        ) : (
          <section className="users-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Users</p>
                <h3>User Management</h3>
              </div>
            </div>

            <div className="users-stack">
              <article className="user-form-panel">
                <form className="user-form" onSubmit={handleAddUser}>
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">User Form</p>
                      <h3>{editingUserId === null ? 'Add User' : 'Edit User'}</h3>
                    </div>
                  </div>
                  <label>
                    Username
                    <input
                      type="text"
                      value={userForm.username}
                      onChange={(event) =>
                        setUserForm({ ...userForm, username: event.target.value })
                      }
                      placeholder="e.g. akl.manager"
                      required
                    />
                  </label>
                  <label>
                    First name
                    <input
                      type="text"
                      value={userForm.firstName}
                      onChange={(event) =>
                        setUserForm({ ...userForm, firstName: event.target.value })
                      }
                      placeholder="First name"
                      required
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      type="text"
                      value={userForm.lastName}
                      onChange={(event) =>
                        setUserForm({ ...userForm, lastName: event.target.value })
                      }
                      placeholder="Last name"
                      required
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(event) =>
                        setUserForm({ ...userForm, email: event.target.value })
                      }
                      placeholder="name@myrentalcar.co.nz"
                      required
                    />
                  </label>
                  <label>
                    Default location
                    <select
                      value={userForm.defaultLocation}
                      onChange={(event) =>
                        setUserForm({
                          ...userForm,
                          defaultLocation: event.target.value as UserLocationOption,
                        })
                      }
                    >
                      <option value="all">All</option>
                      {filterOptions.locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="user-checkbox">
                    <input
                      type="checkbox"
                      checked={userForm.isAdmin}
                      onChange={(event) =>
                        setUserForm({ ...userForm, isAdmin: event.target.checked })
                      }
                    />
                    <span>
                      <strong>Is admin</strong>
                      <em>Grants access to settings and users tab</em>
                    </span>
                  </label>

                  <div className="user-form-actions">
                    <button type="submit" className="user-submit-button">
                      {editingUserId === null ? 'Add user' : 'Save changes'}
                    </button>
                    {editingUserId !== null ? (
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={resetUserForm}
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </form>
              </article>

              <article className="users-list-panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Current Users</p>
                    <h3>{users.length} configured</h3>
                  </div>
                </div>

                {userActionMessage ? (
                  <div className="users-action-message">{userActionMessage}</div>
                ) : null}

                {users.length === 0 ? (
                  <div className="users-empty-state">No users added yet.</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>First name</th>
                          <th>Last name</th>
                          <th>Email</th>
                          <th>Default location</th>
                          <th>Admin</th>
                          <th>Edit</th>
                          <th>Reset password</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.defaultLocation === 'all' ? 'All' : user.defaultLocation}</td>
                            <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                            <td>
                              <button
                                type="button"
                                className="table-action"
                                onClick={() => handleEditUser(user)}
                              >
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="table-action"
                                onClick={() => handleResetPassword(user)}
                              >
                                Reset password
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption(option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'positive' | 'neutral' | 'negative';
}) {
  return (
    <div className={`stat-pill ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DistributionBar({
  label,
  count,
  total,
  tone,
}: {
  label: string;
  count: number;
  total: number;
  tone: 'positive' | 'neutral' | 'negative';
}) {
  const width = total === 0 ? 0 : (count / total) * 100;

  return (
    <div className="distribution-item">
      <div className="distribution-meta">
        <span>{label}</span>
        <strong>{count}</strong>
      </div>
      <div className="distribution-track">
        <div className={`distribution-fill ${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className ? `detail-item ${className}` : 'detail-item'}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function calculateStats(entries: RespondedFeedback[]) {
  const totalResponses = entries.length;
  const promoters = entries.filter((entry) => entry.score >= 9).length;
  const passives = entries.filter((entry) => entry.score >= 7 && entry.score <= 8).length;
  const detractors = entries.filter((entry) => entry.score <= 6).length;
  const scoreTotal = entries.reduce((sum, entry) => sum + entry.score, 0);
  const averageScore = totalResponses === 0 ? 0 : scoreTotal / totalResponses;
  const npsScore =
    totalResponses === 0
      ? 0
      : Math.round((promoters / totalResponses) * 100 - (detractors / totalResponses) * 100);

  return {
    totalResponses,
    promoters,
    passives,
    detractors,
    averageScore,
    npsScore,
  };
}

function hasResponse(entry: FeedbackItem): entry is RespondedFeedback {
  return entry.score !== null;
}

function findTopValue<T>(entries: FeedbackItem[], accessor: (entry: FeedbackItem) => T) {
  if (entries.length === 0) {
    return 'No data';
  }

  const counts = new Map<T, number>();

  entries.forEach((entry) => {
    const value = accessor(entry);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  let topValue = accessor(entries[0]);
  let topCount = counts.get(topValue) ?? 0;

  counts.forEach((count, value) => {
    if (count > topCount) {
      topValue = value;
      topCount = count;
    }
  });

  return String(topValue);
}

function formatOption(option: string) {
  if (option === 'all') {
    return 'All';
  }

  if (option === 'passive') {
    return 'Neutral';
  }

  return option.charAt(0).toUpperCase() + option.slice(1);
}

function formatComment(comment: string | null) {
  if (comment === null) {
    return 'Survey sent, no customer reply yet.';
  }

  return comment.trim() || 'No additional comments provided.';
}

function escapeCsvValue(value: string) {
  const normalizedValue = value.replace(/"/g, '""');
  return `"${normalizedValue}"`;
}

function getSuggestedReplyTemplate(score: number | null): ReplyTemplateKey {
  const segment = classifySegment(score);

  if (segment === 'passive' || segment === 'detractor') {
    return segment;
  }

  return 'promoter';
}

function formatReplyTemplateLabel(templateKey: ReplyTemplateKey) {
  switch (templateKey) {
    case 'promoter':
      return 'Promoter Reply';
    case 'passive':
      return 'Passive Reply';
    case 'detractor':
      return 'Detractor Reply';
  }
}

function renderReplyTemplate(
  template: string,
  entry: FeedbackItem,
  staffComments: string,
) {
  return template
    .replaceAll('{{first_name}}', entry.firstName)
    .replaceAll('{{last_name}}', entry.lastName)
    .replaceAll('{{score}}', entry.score === null ? '' : String(entry.score))
    .replaceAll('{{staffcomments}}', formatCommentForHtml(staffComments));
}

function renderReplyTemplatePreview(
  template: string,
  templateKey: ReplyTemplateKey,
) {
  return template
    .replaceAll('{{first_name}}', 'Jordan')
    .replaceAll('{{last_name}}', 'Customer')
    .replaceAll('{{score}}', templateKey === 'promoter' ? '10' : templateKey === 'passive' ? '8' : '5')
    .replaceAll(
      '{{staffcomments}}',
      'Thank you for taking the time to share your feedback with our team.',
    );
}

function formatCommentForHtml(comment: string) {
  return comment.trim().replace(/\n/g, '<br />') || 'Thank you for your feedback.';
}

export default App;
