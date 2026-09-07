// routes/bannerRoutes.ts
import express from "express";
import { deleteBanner, deleteEvent, deleteGalleryImage, deleteNotice, getAllBanners, getAllEvents, getAllGalleryImages, getAllNotices, getUploadBannerImageUrl, getUploadEventImageUrl, getUploadGalleryImageUrl, getUploadNoticePdfUrl, saveBanner, saveEvent, saveGalleryImage, saveNotice } from "../controllers/contentsController";

const router = express.Router();

router.post("/banners/getBannerUploadUrl", getUploadBannerImageUrl);
router.post("/banners/saveBanner", saveBanner);
router.get("/banners/getAllBanners", getAllBanners);
router.delete("/banners/deleteBanner/:id", deleteBanner);

// Event Routes
router.post("/events/getUploadEventImageUrl", getUploadEventImageUrl);
router.post("/events/saveEvent", saveEvent);
router.get("/events/getAllEvents", getAllEvents);
router.delete("/events/deleteEvent/:id", deleteEvent);


//gallery
router.post("/gallery/getUploadGalleryImageUrl", getUploadGalleryImageUrl);
router.post("/gallery/saveGalleryImage", saveGalleryImage);
router.get("/gallery/getAllGalleryImages", getAllGalleryImages);
router.delete("/gallery/deleteGalleryImage/:id", deleteGalleryImage);

// Notice Routes
 router.post("/notices/getUploadNoticePdfUrl", getUploadNoticePdfUrl);    
 router.post("/notices/saveNotice", saveNotice);
 router.get("/notices/getAllNotices", getAllNotices); 
 router.delete("/notices/deleteNotice/:id", deleteNotice);

export default router;
