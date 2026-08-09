const providers = {
  dropbox: null,
  googleDrive: null,
  local: null,
};

function setProvider(name, module) {
  if (!module) throw new Error(`Provider '${name}' module cannot be null.`);
  providers[name] = module;
}

function getProvider(name) {
  const provider = providers[name];
  if (!provider) throw new Error(`Provider '${name}' not configured.`);
  return provider;
}

async function upload(file, options = {}) {
  const providerName = options.provider || 'dropbox';
  const provider = getProvider(providerName);
  return provider.upload(file, options);
}

module.exports = { setProvider, getProvider, upload };