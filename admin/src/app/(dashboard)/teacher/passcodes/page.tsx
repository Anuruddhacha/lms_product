"use client";

import React, { useState, useMemo } from "react";
import {
  useSavePasscodeIfNotTakenMutation,
  useGetAllPasscodesQuery,
  useDeletePasscodeByCodeMutation,
  useDeleteUserAndDataByEmailMutation,
} from "@/state/api";
import { Mail, Phone, Key, Search, Copy, RotateCcw } from "lucide-react";

const AdminPasscodeGenerator = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [savePasscode] = useSavePasscodeIfNotTakenMutation();
  const { data: passcodeData, isLoading, refetch } = useGetAllPasscodesQuery();
  const [deletePasscode] = useDeletePasscodeByCodeMutation();
  const [deleteUserAndDataByEmail] = useDeleteUserAndDataByEmailMutation();
  const [resettingEmail, setResettingEmail] = useState<string | null>(null);


  const generateRandomPasscode = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

  const [copied, setCopied] = useState(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(passcode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  } catch (err) {
    console.error("Failed to copy", err);
  }
};


const handleGenerate = async () => {
  setError("");
  setSuccess("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/; // 10 digit local number

  if (!email.trim() || !phone.trim()) {
    setError("Email and phone are required.");
    return;
  }

  if (!emailRegex.test(email.trim())) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!phoneRegex.test(phone.trim())) {
    setError("Phone number must be 10 digits (e.g. 0717114523).");
    return;
  }

  const newPasscode = generateRandomPasscode();
  setPasscode(newPasscode);
  setSaving(true);

  try {
    const res = await savePasscode({ passcode: newPasscode, email, phone }).unwrap();

    if (res.success) {
      setSuccess(`✅ Passcode saved: ${newPasscode}`);
      setEmail("");
      setPhone("");
      setPasscode("");
      refetch();
    } else {
      setError(res.message || "Failed to save passcode.");
    }
  } catch (err) {
    setError("Error saving passcode. Try again.");
    console.error(err);
  } finally {
    setSaving(false);
  }
};

const handleDelete = async (passcodeToDelete: string) => {
  const confirmed = window.confirm(`Are you sure you want to delete passcode: ${passcodeToDelete}?`);
  if (!confirmed) return;

  try {
    const res = await deletePasscode({ passcode: passcodeToDelete }).unwrap();
    if (res.success) {
      setSuccess(`Passcode ${passcodeToDelete} deleted successfully.`);
      refetch();
    } else {
      setError(res.message || "Failed to delete passcode.");
    }
  } catch (err) {
    setError("Error deleting passcode.");
    console.error(err);
  }
};

// Wipes the student's user account, course applications, and registration
// codes for this email — used to unblock a student whose registration got
// stuck mid-way (e.g. "Email already used for a registration code" with no
// way to retry). Does not touch the passcode row itself; use Delete for that.
const handleResetStudent = async (studentEmail: string) => {
  if (!studentEmail) return;

  const confirmed = window.confirm(
    `Reset all registration data for ${studentEmail}?\n\nThis permanently deletes their user account, course applications, and registration codes so they can register again from scratch. This cannot be undone.`
  );
  if (!confirmed) return;

  setError("");
  setSuccess("");
  setResettingEmail(studentEmail);

  try {
    const res = await deleteUserAndDataByEmail(studentEmail).unwrap();
    if (res.success) {
      setSuccess(`All registration data for ${studentEmail} has been reset.`);
    } else {
      setError(res.message || "Failed to reset student data.");
    }
  } catch (err: any) {
    // A 404 here just means there was no user account yet (only a stuck
    // registration code/application) — still a useful outcome to report.
    setError(err?.data?.message || "Error resetting student data.");
    console.error(err);
  } finally {
    setResettingEmail(null);
  }
};




  // Filtered passcode list
  const filteredPasscodes = useMemo(() => {
    if (!passcodeData) return [];
    const term = searchTerm.toLowerCase();
    return passcodeData.filter(
      (item: any) =>
        item.email?.toLowerCase().includes(term) ||
        item.phone?.toLowerCase().includes(term)
    );
  }, [passcodeData, searchTerm]);

  return (
    <div className="max-w-5xl mx-auto mt-8 px-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-udemy-black mb-1">Passcodes</h1>
        <p className="text-udemy-gray text-sm">Generate and manage student registration passcodes</p>
      </div>

      {/* Generate Passcode Card */}
      <div className="bg-white-100 border border-gray-200 rounded-md shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-udemy-black">Generate a New Passcode</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-udemy-black">User Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 p-2.5 bg-white-100 text-udemy-black border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-udemy-purple/30 focus:border-udemy-purple"
              />
              <Mail className="absolute top-3 left-3 h-4 w-4 text-udemy-gray" />
            </div>
          </div>

          {/* Phone Input */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-udemy-black">User Phone</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full pl-10 p-2.5 bg-white-100 text-udemy-black border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-udemy-purple/30 focus:border-udemy-purple"
              />
              <Phone className="absolute top-3 left-3 h-4 w-4 text-udemy-gray" />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={saving}
          className="w-full sm:w-auto bg-udemy-purple text-white-100 font-bold px-6 py-2.5 rounded-sm hover:bg-udemy-purpleDark transition-colors disabled:opacity-50"
        >
          {saving ? "Generating..." : "Generate Passcode"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-udemy-purple text-sm">{success}</p>}

        {passcode && (
          <div className="flex items-center gap-2 bg-udemy-purpleLight border border-udemy-purple/30 px-4 py-3 rounded-sm">
            <Key className="w-4 h-4 text-udemy-purple shrink-0" />
            <span className="font-semibold text-udemy-black text-sm">Generated Passcode:</span>
            <span className="text-udemy-black font-mono">{passcode}</span>
            <button
              onClick={handleCopy}
              className="ml-2 text-udemy-purple hover:text-udemy-purpleDark transition"
              title="Copy passcode"
            >
              <Copy className="w-4 h-4" />
            </button>
            {copied && <span className="text-udemy-purple text-sm ml-1">Copied!</span>}
          </div>
        )}
      </div>

      {/* Generated Passcodes Card */}
      <div className="bg-white-100 border border-gray-200 rounded-md shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-udemy-black">
            Generated Passcodes
            <span className="ml-2 text-sm font-normal text-udemy-gray">
              ({filteredPasscodes.length})
            </span>
          </h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by email or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 p-2 bg-white-100 text-udemy-black border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-udemy-purple/30 focus:border-udemy-purple"
            />
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-udemy-gray" />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-udemy-gray text-sm">Loading passcodes...</p>
        ) : (
          <div className="overflow-auto max-h-96 rounded-sm border border-gray-200">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-udemy-lightGray text-udemy-black sticky top-0">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Passcode</th>
                  <th className="px-4 py-2.5 font-semibold">Email</th>
                  <th className="px-4 py-2.5 font-semibold">Phone</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPasscodes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-udemy-gray">
                      No matching passcodes found.
                    </td>
                  </tr>
                ) : (
                  filteredPasscodes.map((item: any, i: number) => (
                    <tr key={item.id || i} className="hover:bg-udemy-lightGray transition-colors">
                      <td className="px-4 py-2.5 font-mono text-udemy-black">{item.passcode}</td>
                      <td className="px-4 py-2.5 text-udemy-black">{item.email}</td>
                      <td className="px-4 py-2.5 text-udemy-black">{item.phone}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            item.isTaken
                              ? "bg-udemy-purpleLight text-udemy-purple"
                              : "bg-gray-100 text-udemy-gray"
                          }`}
                        >
                          {item.isTaken ? "Used" : "Unused"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResetStudent(item.email)}
                            disabled={resettingEmail === item.email}
                            className="inline-flex items-center gap-1 border border-red-600 text-red-600 px-3 py-1 rounded-sm hover:bg-red-50 transition-colors text-xs font-semibold disabled:opacity-50"
                            title="Delete this student's account, applications, and registration codes so they can register again"
                          >
                            <RotateCcw className="w-3 h-3" />
                            {resettingEmail === item.email ? "Resetting..." : "Reset Student"}
                          </button>
                          <button
                            onClick={() => handleDelete(item.passcode)}
                            className="bg-red-600 text-white-100 px-3 py-1 rounded-sm hover:bg-red-700 transition-colors text-xs font-semibold"
                            title="Delete passcode"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPasscodeGenerator;
