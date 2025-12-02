"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { DashboardLayout } from "@/components/DashboardLayout";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ⭐ NEW IMPORT FOR SELECT
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DriverInformationForm() {
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
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
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, [key]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("You are not logged in!");
      setSubmitting(false);
      return;
    }

    const form = new FormData();
    form.append("phone", formData.phone);
    form.append("address", formData.address);
    form.append("nid", formData.nid);
    form.append("license", formData.license);
    form.append("vehicleRegNo", formData.vehicleRegNo);
    form.append("vehicleType", formData.vehicleType);
    form.append("vehicleModel", formData.vehicleModel);
    form.append("experience", formData.experience);

    if (formData.licenseImg) form.append("licenseImg", formData.licenseImg);
    if (formData.regCertImg) form.append("regCertImg", formData.regCertImg);

    const API_BASE_URL = "http://localhost:4000/api";

    try {
      const res = await fetch(`${API_BASE_URL}/drivers/additional-info`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      console.log("Response:", data);

      if (data.data) {
        toast.success("Driver info submitted successfully!");
        setFormData(initialFormData);
      } else {
        toast.error(data.error || "Failed!");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }

    setSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto mt-12 p-6 bg-card/50 dark:bg-[#08010f]/50 shadow-lg rounded-2xl border border-gray-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Driver Onboarding Form
          </h1>
          <p className="text-gray-500 text-sm">
            Provide accurate details to verify your account & get approval.
          </p>
        </div>

        <Form.Root onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <Form.Field name="phone">
            <Form.Label className="font-medium text-sm">Phone Number</Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                className="w-full mt-1"
                placeholder="+8801XXXXXXXXX"
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Form.Control>
          </Form.Field>

          {/* Address */}
          <Form.Field name="address">
            <Form.Label className="font-medium text-sm">Permanent Address</Form.Label>
            <Form.Control asChild>
              <Textarea
                className="w-full mt-1"
                placeholder="House/Road, City, District"
                rows={2}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
            </Form.Control>
          </Form.Field>

          {/* NID */}
          <Form.Field name="nid">
            <Form.Label className="font-medium text-sm">NID Number</Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                className="w-full mt-1"
                placeholder="National ID Number"
                onChange={(e) =>
                  setFormData({ ...formData, nid: e.target.value })
                }
                required
              />
            </Form.Control>
          </Form.Field>

          {/* License */}
          <Form.Field name="license">
            <Form.Label className="font-medium text-sm">
              Driving License Number
            </Form.Label>
            <Form.Control asChild>
              <Input
                type="text"
                className="w-full mt-1"
                placeholder="DL-XXXXX-XXXX"
                onChange={(e) =>
                  setFormData({ ...formData, license: e.target.value })
                }
                required
              />
            </Form.Control>
          </Form.Field>

          {/* Vehicle Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Vehicle Reg No */}
            <Form.Field name="vehicleRegNo">
              <Form.Label className="font-medium text-sm">
                Vehicle Registration No.
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="text"
                  className="w-full mt-1"
                  placeholder="ABC-12345"
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleRegNo: e.target.value })
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            {/* ⭐ UPDATED VEHICLE TYPE (shadcn Select) */}
            <Form.Field name="vehicleType">
              <Form.Label className="font-medium text-sm">Vehicle Type</Form.Label>

              <Select
                required
                onValueChange={(value) =>
                  setFormData({ ...formData, vehicleType: value })
                }
              >
                <Form.Control asChild>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select Vehicle Type" />
                  </SelectTrigger>
                </Form.Control>

                <SelectContent>
                  <SelectItem value="Car">Car</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                  <SelectItem value="CNG/Auto">CNG / Auto</SelectItem>
                </SelectContent>
              </Select>
            </Form.Field>

            {/* Vehicle Model */}
            <Form.Field name="vehicleModel">
              <Form.Label className="font-medium text-sm">Vehicle Model</Form.Label>
              <Form.Control asChild>
                <Input
                  type="text"
                  className="w-full mt-1"
                  placeholder="Toyota Aqua, Honda Livo etc."
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleModel: e.target.value })
                  }
                  required
                />
              </Form.Control>
            </Form.Field>

            {/* Experience */}
            <Form.Field name="experience">
              <Form.Label className="font-medium text-sm">
                Experience (Years)
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="number"
                  min={0}
                  className="w-full mt-1"
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  required
                />
              </Form.Control>
            </Form.Field>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* License Img */}
            <Form.Field name="licenseImg">
              <Form.Label className="font-medium text-sm">
                Upload License Image
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-1"
                  onChange={(e) => handleFile(e, "licenseImg")}
                  required
                />
              </Form.Control>
            </Form.Field>

            {/* Vehicle Registration Certificate */}
            <Form.Field name="regCertImg">
              <Form.Label className="font-medium text-sm">
                Vehicle Registration Certificate
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="file"
                  accept="image/*"
                  className="mt-1"
                  onChange={(e) => handleFile(e, "regCertImg")}
                  required
                />
              </Form.Control>
            </Form.Field>
          </div>

          {/* Submit Button */}
          <Form.Submit asChild>
            <button
              disabled={submitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold p-3 rounded-xl mt-4 flex items-center justify-center gap-2 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <CheckCircledIcon />
              {submitting ? "Submitted..." : "Submit For Approval"}
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    </DashboardLayout>
  );
}
