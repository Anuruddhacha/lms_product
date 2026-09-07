import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SectionFormData, sectionSchema } from "@/lib/schemas";
import { uploadAllResources } from "@/lib/utils";
import { addSection, closeSectionModal, editSection } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  useDeleteObjectByUrlMutation,
  useGetUploadResourseUrlMutation
} from "@/state/api";


const SectionModal = () => {
  const dispatch = useAppDispatch();
  const { isSectionModalOpen, selectedSectionIndex, sections } = useAppSelector(
    (state) => state.global.courseEditor
  );

  // Local selected files to upload
  const [localResources, setLocalResources] = useState<Resource[]>([]);

  // Uploaded resources with URLs to save in Redux
  const [uploadedResources, setUploadedResources] = useState<UploadedResource[]>([]);

  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const section = selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  const [getUploadResourceUrl] = useGetUploadResourseUrlMutation();

  const [deleteObject] = useDeleteObjectByUrlMutation(); 
  
  const params = useParams();
  const courseId = params.id as string;

  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (section) {
      methods.reset({
        title: section.sectionTitle,
        description: section.sectionDescription,
      });
      setUploadedResources(section.resources || []);
      setLocalResources([]);
      setUploadProgress(0);
      setUploadingFileName(null);
      setIsUploading(false);
    } else {
      methods.reset({ title: "", description: "" });
      setUploadedResources([]);
      setLocalResources([]);
      setUploadProgress(0);
      setUploadingFileName(null);
      setIsUploading(false);
    }
  }, [section, methods]);

  const onClose = () => {
    if (isUploading) {
      toast.error("Please wait for upload to finish before closing.");
      return;
    }
    dispatch(closeSectionModal());
  };

  const onSubmit = (data: SectionFormData) => {
    if (isUploading) {
      toast.error("Please wait for upload to finish before saving.");
      return;
    }

    const newSection: Section = {
      sectionId: section?.sectionId || uuidv4(),
      sectionTitle: data.title,
      sectionDescription: data.description,
      chapters: section?.chapters || [],
      resources: uploadedResources, // use uploaded resource URLs only here
    };

    if (selectedSectionIndex === null) {
      dispatch(addSection(newSection));
    } else {
      dispatch(
        editSection({
          index: selectedSectionIndex,
          section: newSection,
        })
      );
    }

    toast.success("Section saved successfully. Remember to save the course.");
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setLocalResources((prev) => {
      const existingNames = new Set(prev.map((r) => r.fileName));
      const newResources: Resource[] = files
        .filter((file) => !existingNames.has(file.name))
        .map((file) => ({
          file,
          fileName: file.name,
          fileType: file.type,
        }));
      return [...prev, ...newResources];
    });
  };

  const removeFile = (index: number) => {
    setLocalResources((prev) => prev.filter((_, i) => i !== index));
  };



  const handleUploadClick = async () => {
    if (localResources.length === 0) {
      toast.error("Please select files to upload first.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadingFileName(null);

      const uploaded = await uploadAllResources(
        localResources,
        courseId,
        getUploadResourceUrl,
        (progress) => setUploadProgress(progress),
        (fileName) => setUploadingFileName(fileName)
      );

      setUploadedResources((prev) => [...prev, ...uploaded]);
      setLocalResources([]);
      toast.success("All files uploaded successfully.");
    } catch (error) {
      toast.error("Failed to upload some files.");
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadingFileName(null);
    }
  };

  const handleDeleteResource = async (resource: { fileName: string; fileUrl: string }) => {
  const confirmDelete = window.confirm(`Delete resource "${resource.fileName}"?`);
  if (!confirmDelete) return;

  try {
    await deleteObject({ url: resource.fileUrl }).unwrap();

    // Remove from state or wherever uploadedResources is coming from
    setUploadedResources((prev) => prev.filter((r) => r.fileUrl !== resource.fileUrl));

    toast.success("Resource deleted successfully.");
  } catch (error) {
    console.error("Failed to delete resource:", error);
    toast.error("Failed to delete resource.");
  }
};

  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">Add/Edit Section</h2>
          <button onClick={onClose} className="section-modal__close" disabled={isUploading}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="section-modal__form">
            <CustomFormField
              name="title"
              label="Section Title"
              placeholder="Write section title here"
            />

            <CustomFormField
              name="description"
              label="Section Description"
              type="textarea"
              placeholder="Write section description here"
            />

            <div className="mt-4">
              <label className="text-sm font-medium">Select Resources (PDF, DOC, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                multiple
                onChange={handleFileChange}
                className="mt-2"
                disabled={isUploading}
              />
              {localResources.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {localResources.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{file.fileName}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-red-500 text-xs"
                        disabled={isUploading}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {uploadedResources.length > 0 && (
        <>
    <h4 className="mt-4 font-semibold">Uploaded Resources</h4>
    <ul className="mt-2 space-y-1 text-sm text-green-600">
      {uploadedResources.map((res, idx) => (
        <li key={idx} className="flex items-center justify-between gap-2">
          <span>{res.fileName}</span>
          <button
            type="button"
            onClick={() => handleDeleteResource(res)}
            className="text-red-600 hover:text-red-800 text-xs"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  </>
)}

            </div>

            <div className="mt-4 flex items-center space-x-4">
              <Button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading || localResources.length === 0}
              >
                {isUploading ? `Uploading: ${uploadingFileName} (${uploadProgress}%)` : "Upload Selected Files"}
              </Button>
            </div>

            <div className="section-modal__actions mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700" disabled={isUploading}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SectionModal;
