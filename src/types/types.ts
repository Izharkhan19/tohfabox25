export interface UploadedItem {
    publicId: string;
    cloudinaryUrl: string;
    resourceType: string;
    uploadedAt: Date;
    format?: string;
    bytes?: number;
    url: string;
    createdAt: string;
}
