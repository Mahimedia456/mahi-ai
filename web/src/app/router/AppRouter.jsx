import { Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";
import AuthLayout from "../../layouts/AuthLayout";
import UserLayout from "../../layouts/UserLayout";
import AdminLayout from "../../layouts/AdminLayout";

import UsersPage from "../../features/admin/pages/UsersPage";
import SuspendedUsersPage from "../../features/admin/pages/SuspendedUsersPage";
import UserActivityPage from "../../features/admin/pages/UserActivityPage";
import UserDetailsPage from "../../features/admin/pages/UserDetailsPage";
import UserFormPage from "../../features/admin/pages/UserFormPage";

import ContentImagesPage from "../../features/admin/pages/ContentImagesPage";
import ContentVideosPage from "../../features/admin/pages/ContentVideosPage";
import ReportedContentPage from "../../features/admin/pages/ReportedContentPage";
import ContentDetailsPage from "../../features/admin/pages/ContentDetailsPage";
import ContentUploadPage from "../../features/admin/pages/ContentUploadPage";

import StorageUsagePage from "../../features/admin/pages/StorageUsagePage";
import MediaBucketsPage from "../../features/admin/pages/MediaBucketsPage";
import MediaBucketDetailPage from "../../features/admin/pages/MediaBucketDetailPage";

import AnalyticsPage from "../../features/admin/pages/AnalyticsPage";
import LogsPage from "../../features/admin/pages/LogsPage";

import LandingPage from "../../features/landing/pages/LandingPage";
import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import ForgotPassword from "../../features/auth/pages/ForgotPassword";
import VerifyOtp from "../../features/auth/pages/VerifyOtp";
import ResetPassword from "../../features/auth/pages/ResetPassword";

import DashboardHome from "../../features/dashboard/pages/DashboardHome";
import AdminDashboard from "../../features/admin/pages/AdminDashboard";
import ChatPage from "../../features/chat/pages/ChatPage";

import PlansPage from "../../features/admin/pages/PlansPage";
import TransactionsPage from "../../features/admin/pages/TransactionsPage";
import RefundsPage from "../../features/admin/pages/RefundsPage";
import PlanDetailsPage from "../../features/admin/pages/PlanDetailsPage";
import PlanFormPage from "../../features/admin/pages/PlanFormPage";

import AdminSettingsPage from "../../features/admin/pages/AdminSettingsPage";
import ModelsPage from "../../features/admin/pages/ModelsPage";
import ModelAnalyticsPage from "../../features/admin/pages/ModelAnalyticsPage";
import ModelDetailsPage from "../../features/admin/pages/ModelDetailsPage";


import AdminNotificationsPage from "../../features/admin/pages/AdminNotificationsPage";
import AdminProfilePage from "../../features/admin/pages/AdminProfilePage";


import ImageStudioLayout from "../../features/imageStudio/layouts/ImageStudioLayout";
import ImageStudioHome from "../../features/imageStudio/pages/ImageStudioHome";
import ImageStudioGenerating from "../../features/imageStudio/pages/ImageStudioGenerating";
import ImageStudioResults from "../../features/imageStudio/pages/ImageStudioResults";
import ImageStudioAssets from "../../features/imageStudio/pages/ImageStudioAssets";
import ImageStudioHistory from "../../features/imageStudio/pages/ImageStudioHistory";
import ImageStudioPresets from "../../features/imageStudio/pages/ImageStudioPresets";
import ImageEditorHome from "../../features/imageStudio/pages/ImageEditorHome";
import ImageEditorMagicTools from "../../features/imageStudio/pages/ImageEditorMagicTools";
import ImageEditorGenerativeFill from "../../features/imageStudio/pages/ImageEditorGenerativeFill";
import ImageEditorUpscale from "../../features/imageStudio/pages/ImageEditorUpscale";
import ImageEditorHistory from "../../features/imageStudio/pages/ImageEditorHistory";

import VideoStudioLayout from "../../features/videoStudio/layouts/VideoStudioLayout";
import VideoStudioHome from "../../features/videoStudio/pages/VideoStudioHome";
import VideoStudioGenerating from "../../features/videoStudio/pages/VideoStudioGenerating";
import VideoStudioResults from "../../features/videoStudio/pages/VideoStudioResults";
import VideoStudioFrameToVideo from "../../features/videoStudio/pages/VideoStudioFrameToVideo";
import VideoStudioHistory from "../../features/videoStudio/pages/VideoStudioHistory";
import VideoStudioLibrary from "../../features/videoStudio/pages/VideoStudioLibrary";

import ProjectWorkspaceLayout from "../../features/projects/layouts/ProjectWorkspaceLayout";
import ProjectsPage from "../../features/projects/pages/ProjectsPage";
import ProjectDetailsPage from "../../features/projects/pages/ProjectDetailsPage";
import MediaLibraryPage from "../../features/projects/pages/MediaLibraryPage";

import SystemPanelLayout from "../../features/billing/layouts/SystemPanelLayout";
import AccountPage from "../../features/account/pages/AccountPage";
import BillingPage from "../../features/billing/pages/BillingPage";
import PricingPage from "../../features/billing/pages/PricingPage";
import PromptHistoryPage from "../../features/history/pages/PromptHistoryPage";
import NotificationsPage from "../../features/notifications/pages/NotificationsPage";

function Placeholder({ title }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
      <div className="rounded-[28px] border border-mahi-outlineVariant/30 bg-black/40 px-8 py-12 backdrop-blur-xl">
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
        <p className="mt-2 text-sm text-white/45">Module screen coming next.</p>
      </div>
    </div>
  );
}

function isUserAuthenticated() {
  return localStorage.getItem("mahi_auth_token") === "true";
}

function isAdminAuthenticated() {
  return localStorage.getItem("mahi_admin_auth") === "true";
}

function ProtectedUserRoute({ children }) {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedAdminRoute({ children }) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AuthRedirectRoute({ children }) {
  if (isAdminAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }

  if (isUserAuthenticated()) {
    return <Navigate to="/app" replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route
        element={
          <AuthRedirectRoute>
            <AuthLayout />
          </AuthRedirectRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedUserRoute>
            <UserLayout />
          </ProtectedUserRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="analytics" element={<Placeholder title="Analytics" />} />
        <Route path="help" element={<Placeholder title="Help" />} />
        <Route path="notifications" element={<NotificationsPage />} />

        <Route element={<ProjectWorkspaceLayout />}>
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
          <Route path="media-library" element={<MediaLibraryPage />} />
        </Route>

        <Route element={<ImageStudioLayout />}>
          <Route path="image-studio" element={<ImageStudioHome />} />
          <Route path="image-studio/generating" element={<ImageStudioGenerating />} />
          <Route path="image-studio/results" element={<ImageStudioResults />} />
          <Route path="image-studio/assets" element={<ImageStudioAssets />} />
          <Route path="image-studio/history" element={<ImageStudioHistory />} />
          <Route path="image-studio/presets" element={<ImageStudioPresets />} />

          <Route path="image-editor" element={<ImageEditorHome />} />
          <Route path="image-editor/magic-tools" element={<ImageEditorMagicTools />} />
          <Route path="image-editor/generative-fill" element={<ImageEditorGenerativeFill />} />
          <Route path="image-editor/upscale" element={<ImageEditorUpscale />} />
          <Route path="image-editor/history" element={<ImageEditorHistory />} />
        </Route>

        <Route element={<VideoStudioLayout />}>
          <Route path="video-studio" element={<VideoStudioHome />} />
          <Route path="video-studio/generating" element={<VideoStudioGenerating />} />
          <Route path="video-studio/results" element={<VideoStudioResults />} />
          <Route path="video-studio/frame-to-video" element={<VideoStudioFrameToVideo />} />
          <Route path="video-studio/history" element={<VideoStudioHistory />} />
          <Route path="video-studio/library" element={<VideoStudioLibrary />} />
        </Route>

        <Route element={<SystemPanelLayout />}>
          <Route path="profile" element={<AccountPage />} />
          <Route path="settings" element={<AccountPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="prompt-history" element={<PromptHistoryPage />} />
        </Route>
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="users" element={<UsersPage />} />
        <Route path="users/new" element={<UserFormPage />} />
        <Route path="users/suspended" element={<SuspendedUsersPage />} />
        <Route path="users/activity" element={<UserActivityPage />} />
        <Route path="users/:userId" element={<UserDetailsPage />} />
        <Route path="users/:userId/edit" element={<UserFormPage />} />

        <Route path="subscriptions/plans" element={<PlansPage />} />
        <Route path="subscriptions/plans/new" element={<PlanFormPage />} />
        <Route path="subscriptions/plans/:planId" element={<PlanDetailsPage />} />
        <Route path="subscriptions/plans/:planId/edit" element={<PlanFormPage />} />
        <Route path="subscriptions/transactions" element={<TransactionsPage />} />
        <Route path="subscriptions/refunds" element={<RefundsPage />} />

        <Route path="content/images" element={<ContentImagesPage />} />
        <Route path="content/videos" element={<ContentVideosPage />} />
        <Route path="content/reported" element={<ReportedContentPage />} />
        <Route path="/admin/content/upload" element={<ContentUploadPage />} />
        <Route path="content/:contentId" element={<ContentDetailsPage />} />

        <Route path="/admin/storage/usage" element={<StorageUsagePage />} />
        <Route path="/admin/storage/buckets" element={<MediaBucketsPage />} />
        <Route path="/admin/storage/buckets/:bucketId" element={<MediaBucketDetailPage />} />

        <Route path="models" element={<ModelsPage />} />
        <Route path="models/analytics" element={<ModelAnalyticsPage />} />
        <Route path="models/:modelId" element={<ModelDetailsPage />} />

        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />

        <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
                
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}