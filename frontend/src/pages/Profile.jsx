import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Shield, LogOut } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });





  const handleProfileSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await updateUser(profileForm);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setError("Please fill all password fields.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Confirm password does not match.");
      return;
    }

    setSaving(true);
    try {
      await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Password changed successfully.");
    } catch (err) {
      setError(err.message || "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };



  const tabs = useMemo(
    () => [
      { id: "profile", label: "Profile", icon: User },
      { id: "security", label: "Security", icon: Shield },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
          My Account
        </h1>

        {error ? (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 h-fit">
            <div className="mb-4">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-[#FF385C] text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
            {activeTab === "profile" ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            ) : null}

            {activeTab === "security" ? (
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <h2 className="text-xl font-semibold text-gray-900">
                  Change password
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#FF385C] text-white rounded-lg hover:bg-[#E31C5F] disabled:opacity-70"
                >
                  {saving ? "Updating..." : "Update password"}
                </button>
              </form>
            ) : null}


          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
