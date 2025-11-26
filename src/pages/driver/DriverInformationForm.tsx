"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { CheckCircledIcon, UploadIcon } from "@radix-ui/react-icons";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function DriverInformationForm() {
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    nid: "",
    license: "",
    vehicleRegNo: "",
    vehicleType: "",
    vehicleModel: "",
    experience: "",
    licenseImg: null as File | null,
    regCertImg: null as File | null,
  });

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [key]: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
    console.log("Submitted Data:", formData);
  };

  return (
    <DashboardLayout>
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      
      
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Driver Onboarding Form</h1>
        <p className="text-gray-500 text-sm">
          Provide accurate details to verify your account & get approval.
        </p>
      </div>

      <Form.Root onSubmit={handleSubmit} className="space-y-6">
        
        {/* Phone Number */}
        <Form.Field name="phone">
          <Form.Label className="font-medium text-sm">Phone Number</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
              placeholder="+8801XXXXXXXXX"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </Form.Control>
        </Form.Field>

        {/* Address */}
        <Form.Field name="address">
          <Form.Label className="font-medium text-sm">Permanent Address</Form.Label>
          <Form.Control asChild>
            <textarea
              className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
              placeholder="House/Road, City, District"
              rows={2}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </Form.Control>
        </Form.Field>

        {/* NID */}
        <Form.Field name="nid">
          <Form.Label className="font-medium text-sm">NID Number</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
              placeholder="National ID Number"
              onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
              required
            />
          </Form.Control>
        </Form.Field>

        {/* License */}
        <Form.Field name="license">
          <Form.Label className="font-medium text-sm">Driving License Number</Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
              placeholder="DL-XXXXX-XXXX"
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              required
            />
          </Form.Control>
        </Form.Field>

        {/* Vehicle Info Group */}
        <div className="grid grid-cols-2 gap-4">
          
          <Form.Field name="vehicleRegNo">
            <Form.Label className="font-medium text-sm">Vehicle Registration No.</Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
                placeholder="ABC-12345"
                onChange={(e) => setFormData({ ...formData, vehicleRegNo: e.target.value })}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="vehicleType">
            <Form.Label className="font-medium text-sm">Vehicle Type</Form.Label>
            <Form.Control asChild>
              <select
                className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                required
              >
                <option value="">Select Type</option>
                <option>Car</option>
                <option>Bike</option>
                <option>CNG/Auto</option>
              </select>
            </Form.Control>
          </Form.Field>

          <Form.Field name="vehicleModel">
            <Form.Label className="font-medium text-sm">Vehicle Model</Form.Label>
            <Form.Control asChild>
              <input
                type="text"
                className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
                placeholder="Toyota Aqua, Honda Livo etc."
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="experience">
            <Form.Label className="font-medium text-sm">Experience (Years)</Form.Label>
            <Form.Control asChild>
              <input
                type="number"
                min={0}
                className="w-full mt-1 border rounded-lg p-3 outline-blue-500"
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
            </Form.Control>
          </Form.Field>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* License Image */}
          <Form.Field name="licenseImg">
            <Form.Label className="font-medium text-sm">Upload License Image</Form.Label>
            <Form.Control asChild>
              <input
                type="file"
                accept="image/*"
                className="block mt-1 cursor-pointer"
                onChange={(e) => handleFile(e, "licenseImg")}
                required
              />
            </Form.Control>
          </Form.Field>

          {/* Vehicle Certificate */}
          <Form.Field name="regCertImg">
            <Form.Label className="font-medium text-sm">Vehicle Registration Certificate</Form.Label>
            <Form.Control asChild>
              <input
                type="file"
                accept="image/*"
                className="block mt-1 cursor-pointer"
                onChange={(e) => handleFile(e, "regCertImg")}
                required
              />
            </Form.Control>
          </Form.Field>
        </div>

    
        <Form.Submit asChild>
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold p-3 rounded-xl mt-4 flex items-center justify-center gap-2">
            <CheckCircledIcon /> Submit For Approval
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
    </DashboardLayout>
  );
}
