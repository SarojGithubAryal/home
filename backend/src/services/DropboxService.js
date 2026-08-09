const { Dropbox } = require('dropbox');

class DropboxService {
  constructor(accessToken) {
    if (!accessToken) {
      throw new Error('Dropbox access token is required');
    }
    this.dbx = new Dropbox({ accessToken, fetch: globalThis.fetch });
  }

  /**
   * Generic upload method that matches the uploadMedia utility's expected signature.
   * @param {Buffer} fileBuffer
   * @param {object} options – { dropboxPath, mimeType, ... }
   */
  async upload(fileBuffer, options = {}) {
    const { dropboxPath, mimeType } = options;
    if (!dropboxPath) throw new Error('dropboxPath is required');
    return this.uploadFile(fileBuffer, dropboxPath, mimeType);
  }

  /**
   * Upload a file buffer to the specified Dropbox path.
   * Returns the Dropbox file metadata.
   */
  async uploadFile(fileBuffer, dropboxPath, mimeType) {
    const response = await this.dbx.filesUpload({
      path: dropboxPath,
      contents: fileBuffer,
      mode: 'add',
      autorename: true,
      mute: true,
    });
    return response.result;
  }

  /**
   * Create a shared link (view‑only) for a given Dropbox file path.
   * Returns the direct download URL.
   */
  async getSharedLink(dropboxPath) {
    const links = await this.dbx.sharingListSharedLinks({ path: dropboxPath });
    if (links.result.links.length > 0) {
      return links.result.links[0].url.replace('?dl=0', '?dl=1');
    }

    const share = await this.dbx.sharingCreateSharedLinkWithSettings({
      path: dropboxPath,
      settings: { requested_visibility: 'public' },
    });
    return share.result.url.replace('?dl=0', '?dl=1');
  }

  /**
   * Delete a file or folder from Dropbox.
   */
  async deleteFile(dropboxPath) {
    try {
      await this.dbx.filesDeleteV2({ path: dropboxPath });
    } catch (err) {
      // If the file is already missing, treat as success
      if (err.status === 409 && err.error?.error_summary?.startsWith('path_lookup/not_found')) {
        console.log(`Dropbox file already missing, skipping deletion: ${dropboxPath}`);
        return;
      }
      throw err;
    }
  }
}

module.exports = DropboxService;