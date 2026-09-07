"use client";

import React, { useState, useMemo } from "react";
import {
  useSavePasscodeIfNotTakenMutation,
  useGetAllPasscodesQuery,
  useDeletePasscodeByCodeMutation,
} from "@/state/api";
import { Mail, Phone, Key, Search, Copy } from "lucide-react";

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
    <div className="max-w-4xl mx-auto mt-12 px-6 py-8 bg-green-50 rounded-xl shadow-lg space-y-8 text-black">
      <div>
        <h1 className="text-3xl font-bold text-green-900 mb-1">Passcodes</h1>
        <p className="text-green-800 text-sm">Generate and manage user passcodes</p>
      </div>

      {/* Input Fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Email Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-green-900">User Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full pl-10 p-2 bg-gray-100 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Mail className="absolute top-2.5 left-2.5 h-5 w-5 text-green-700" />
          </div>
        </div>

        {/* Phone Input */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-green-900">User Phone</label>
          <div className="relative">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full pl-10 p-2 bg-gray-100 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Phone className="absolute top-2.5 left-2.5 h-5 w-5 text-green-700" />
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={saving}
        className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50"
      >
        {saving ? "Generating..." : "Generate Passcode"}
      </button>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-700">{success}</p>}
      
      

      {passcode && (
  <div className="flex items-center gap-2 mt-2 bg-green-100 border border-green-300 px-3 py-2 rounded-md text-black">
    <Key className="w-4 h-4 text-green-700" />
    <span className="font-semibold text-green-800">Generated Passcode:</span>
    <span className="text-green-900 font-mono">{passcode}</span>
    <button
      onClick={handleCopy}
      className="ml-2 text-green-700 hover:text-green-900 transition"
      title="Copy passcode"
    >
      <Copy className="w-4 h-4" />
    </button>
    {copied && <span className="text-green-700 text-sm ml-2">Copied!</span>}
  </div>
)}


      <hr className="my-6 border-green-200" />

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-semibold text-green-900 text-black">Generated Passcodes</h2>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by email or phone"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 p-2 bg-gray-100 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute top-2.5 left-2.5 h-5 w-5 text-green-700" />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-green-700">Loading passcodes...</p>
      ) : (
        <div className="overflow-auto max-h-96 rounded-md border border-green-200">
          <table className="min-w-full text-sm text-left bg-green-100">
            <thead className="bg-green-200 text-green-900">
              <tr>
                <th className="px-4 py-2 border">Passcode</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Used?</th>
              </tr>
            </thead>
          
          
          <tbody>
  {filteredPasscodes.length === 0 ? (
    <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-600">No matching passcodes found.</td></tr>
  ) : (
    filteredPasscodes.map((item: any, i: number) => (
      <tr key={item.id || i} className="even:bg-green-50 hover:bg-green-200/80 transition">
        <td className="px-4 py-2 border">{item.passcode}</td>
        <td className="px-4 py-2 border">{item.email}</td>
        <td className="px-4 py-2 border">{item.phone}</td>
        <td className="px-4 py-2 border">{item.isTaken ? "✅ Yes" : "❌ No"}</td>
        <td className="px-4 py-2 border">
          <button
            onClick={() => handleDelete(item.passcode)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            title="Delete passcode"
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>


          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPasscodeGenerator;
