import { component$, $, useSignal, type Signal } from '@builder.io/qwik';
import { FileUpload } from '@kunai-consulting/qwik';
import { LuX, LuUserCheck, LuUpload } from '@qwikest/icons/lucide';
import { User } from '~/utils/documents';

export interface UploadDocumentData {
  file: File | null;
  description: string;
  signerIds: string;
}

interface FileUploadPopupProps {
  users: User[];
  currentUser: User;
  show: Signal<boolean>;
  onUpload$: (data: UploadDocumentData) => void;
  isLoading?: boolean;
  authToken: string;
}

export const FileUploadPopup = component$<FileUploadPopupProps>(
  ({ users, currentUser, show, onUpload$, isLoading = false, authToken }) => {
    const file = useSignal<File | null>(null);
    const description = useSignal('');
    const selectedSigners = useSignal<Set<number>>(new Set());
    const descriptionRef = useSignal<HTMLTextAreaElement>();

    const handleUpload = $(async () => {
      if (!file.value) return;

      const formData = new FormData();
      formData.append("file", file.value);
      formData.append("description", description.value);

      const signerIds = Array.from(selectedSigners.value).join(",");
      formData.append("signer_id", signerIds);

      console.log("Uploading with signer_id:", signerIds);

      await fetch(`${import.meta.env.VITE_API_URL}documents/upload/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      onUpload$({
        file: null,
        description: description.value,
        signerIds,
      });
    });


    const resetForm = $(() => {
      file.value = null;
      description.value = '';
      selectedSigners.value.clear();
      if (descriptionRef.value) descriptionRef.value.value = '';
    });

    const closePopup = $(() => {
      show.value = false;
      resetForm();
    });

    const toggleSigner = $((userId: number) => {
      const newSet = new Set(selectedSigners.value);
      if (newSet.has(userId)) newSet.delete(userId);
      else newSet.add(userId);
      selectedSigners.value = newSet;
    });

    const toggleCurrentUser = $(() => toggleSigner(currentUser.id));

    return (
      <>
        {show.value && (
          <div class="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
              class="bg-background text-card-foreground rounded-xl border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick$={(e) => e.stopPropagation()}
            >
              <div class="flex items-center justify-between p-6 border-b">
                <h2 class="text-xl font-semibold">Upload Dokumen Baru</h2>
                <button
                  onClick$={closePopup}
                  class="rounded-full p-1 hover:bg-accent hover:text-accent-foreground transition-colors"
                  disabled={isLoading}
                >
                  <LuX class="size-5" />
                </button>
              </div>

              <div class="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div>
                  <h3 class="text-sm font-medium mb-3">File Dokumen</h3>
                  <FileUpload.Root
                    multiple={false}
                    accept=".pdf"
                    onFilesChange$={(files) => {
                      if (files.length > 0 && files[0].file) {
                        file.value = files[0].file;
                      } else {
                        file.value = null;
                      }
                      console.log(file.value?.name)
                    }}
                  >
                    <FileUpload.Input />
                    <FileUpload.Dropzone>
                      <div class="flex flex-col border p-4 rounded-lg justify-center items-center cursor-pointer gap-y-2 hover:bg-background hover:border-primary">
                        <LuUpload class="size-6 mb-2" />
                        <p>Klik atau drag file ke sini</p>
                        <p class="text-xs text-muted-foreground">Hanya PDF (maks. 10MB)</p>
                        <FileUpload.Trigger class="px-4 py-1 bg-primary text-white rounded-md text-sm cursor-pointer">
                          Pilih File
                        </FileUpload.Trigger>
                      </div>
                    </FileUpload.Dropzone>
                  </FileUpload.Root>

                  {file.value && (
                    <div class="mt-2 text-sm text-muted-foreground">
                      {file.value.name} ({(file.value.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}

                </div>

                <div>
                  <h3 class="text-sm font-medium mb-3">Deskripsi Dokumen</h3>
                  <textarea
                    ref={descriptionRef}
                    class="w-full p-3 border rounded-md min-h-[100px] resize-y"
                    placeholder="Masukkan deskripsi dokumen (opsional)"
                    value={description.value}
                    onInput$={(e) =>
                      (description.value = (e.target as HTMLTextAreaElement).value)
                    }
                  />
                </div>

                <div>
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-medium">Penandatangan</h3>
                    <button
                      type="button"
                      onClick$={toggleCurrentUser}
                      class={`flex items-center gap-2 px-3 py-1 rounded-md text-xs transition-colors ${
                        selectedSigners.value.has(currentUser.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <LuUserCheck class="size-4" />
                      {selectedSigners.value.has(currentUser.id) ? 'Hapus Diri Sendiri' : 'Tambahkan Diri Sendiri'}
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        class={`p-3 border rounded-md cursor-pointer transition-all ${
                          selectedSigners.value.has(user.id)
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                            : 'border-muted hover:border-muted-foreground/50'
                        }`}
                        onClick$={() => toggleSigner(user.id)}
                      >
                        <div class="flex items-center gap-3">
                          <div class={`size-3 rounded-full flex items-center justify-center ${
                            selectedSigners.value.has(user.id)
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-muted-foreground/30'
                          }`}>
                            {selectedSigners.value.has(user.id) && (
                              <div class="size-1.5 rounded-full bg-current" />
                            )}
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="font-medium text-sm truncate">{user.full_name}</p>
                            <p class="text-muted-foreground text-xs truncate">{user.username}</p>
                          </div>
                          {user.id === currentUser.id && (
                            <span class="text-xs px-2 py-1 bg-muted rounded-full">Anda</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedSigners.value.size > 0 && (
                    <div class="mt-3">
                      <p class="text-sm text-muted-foreground">
                        Terpilih: {selectedSigners.value.size} penandatangan
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div class="flex justify-end gap-3 p-6 border-t bg-muted/20">
                <button
                  onClick$={closePopup}
                  class="px-4 py-2 text-sm border border-muted-foreground/20 rounded-md hover:bg-muted transition-colors"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button
                  onClick$={handleUpload}
                  disabled={!file.value || isLoading || selectedSigners.value.size === 0}
                  class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading ? 'Mengupload...' : 'Upload Dokumen'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
);
