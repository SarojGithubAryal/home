/**
 * Pluggable media uploader.
 * Currently no provider configured; returns a placeholder URL.
 * Future: integrate with Dropbox, Google Drive, or local storage.
 */

const providers = {
  dropbox: null,   // will be a module
  googleDrive: null,
  local: null,
};

function setProvider(name, module) {
  providers[name] = module;
}

async function upload(file, options = {}) {
  const provider = options.provider || 'local';
  if (!providers[provider]) {
    throw new Error(`Upload provider '${provider}' not configured.`);
  }
  return providers[provider].upload(file, options);
}

module.exports = { setProvider, upload };