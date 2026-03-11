
-- Fix INSERT policy: allow authenticated users to upload (admin uploads to admin/ folder, users to their uid folder)
DROP POLICY IF EXISTS "Authenticated users can upload attachments" ON storage.objects;

CREATE POLICY "Authenticated users can upload support attachments"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'support-attachments');

-- DELETE policy: users can delete their own files (in their uid folder), admins can delete from admin/ folder
CREATE POLICY "Users can delete own support attachments"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND (
    (storage.foldername(name))[1] = (auth.uid())::text
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);
