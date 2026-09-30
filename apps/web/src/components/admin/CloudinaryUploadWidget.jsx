import { useEffect, useRef } from 'react';
import { adminApi } from '../../lib/api';

const CloudinaryUploadWidget = ({ onUploadSuccess, buttonText = "Upload Image", className = "btn-outline" }) => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    const callbackRef = useRef(onUploadSuccess);
    
    useEffect(() => {
        callbackRef.current = onUploadSuccess;
    }, [onUploadSuccess]);

    useEffect(() => {
        const initWidget = () => {
            if (widgetRef.current) return; // Prevent multiple initializations
            cloudinaryRef.current = window.cloudinary;
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'agsidj31',
                uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'arsikarya',
                sources: ['local', 'url', 'camera', 'google_drive'],
                multiple: false,
                clientAllowedFormats: ['image'],
                maxImageFileSize: 5000000, // 5MB
                theme: 'minimal'
            }, async function (error, result) {
                if (!error && result && result.event === "success") {
                    const info = result.info || {};
                    // Auto-register uploaded asset into database Media Library
                    try {
                        await adminApi.saveMedia({
                            publicId: info.public_id || `upload_${Date.now()}`,
                            url: info.secure_url,
                            secureUrl: info.secure_url,
                            format: info.format || 'jpg',
                            width: info.width || 0,
                            height: info.height || 0,
                            bytes: info.bytes || 0,
                            folder: info.folder || 'arsikarya',
                        });
                    } catch (e) {
                        console.warn('Auto-registering media to DB failed:', e);
                    }

                    if (callbackRef.current) {
                        callbackRef.current(info.secure_url, result);
                    }
                }
            });
        };

        if (!document.getElementById('cloudinary-widget-script')) {
            const script = document.createElement('script');
            script.id = 'cloudinary-widget-script';
            script.src = 'https://upload-widget.cloudinary.com/global/all.js';
            script.async = true;
            script.onload = () => {
                initWidget();
            };
            document.body.appendChild(script);
        } else if (window.cloudinary) {
            initWidget();
        }
    }, []);

    return (
        <button 
            type="button" 
            className={className} 
            style={{ padding: '6px 12px', fontSize: '0.85rem', marginLeft: '8px' }}
            onClick={() => widgetRef.current?.open()}
        >
            {buttonText}
        </button>
    );
};

export default CloudinaryUploadWidget;
