/**
 * useRoom.js
 *
 * Owns all state for a single Room Experience and its four documented
 * sub-experiences (Hear, Read, See, Memory).
 *
 * Per 09_DEVELOPMENT_RULES.md layering:
 *   Pages -> Hooks -> Services -> apiClient -> Backend
 *
 * Per 06_API_CONTRACTS.md, the Room Experience itself
 * (GET /api/rooms/:roomSlug) is a separate, complete payload from each
 * sub-experience (GET /api/rooms/:roomSlug/hear|read|see|memory). This
 * hook treats them as separate concerns:
 *   - The base Room Experience loads automatically once a roomSlug is
 *     provided (matches the "arrive on Room page" flow).
 *   - Each sub-experience only loads on demand, via loadSection(), since
 *     a user typically only visits one of Hear/Read/See/Memory at a time
 *     — eagerly fetching all four on room load would request data the
 *     user may never view.
 *
 * This hook does not resolve assets and does not contain any UI logic.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import roomService from '../services/roomService';
import { ROOM_EXPERIENCE_TYPES } from '../utils/constants';

const SECTION_SERVICE_MAP = {
  [ROOM_EXPERIENCE_TYPES.HEAR]: roomService.getHearExperience,
  [ROOM_EXPERIENCE_TYPES.READ]: roomService.getReadExperience,
  [ROOM_EXPERIENCE_TYPES.SEE]: roomService.getSeeExperience,
  [ROOM_EXPERIENCE_TYPES.MEMORY]: roomService.getMemoryExperience,
};

/**
 * @param {string} roomSlug - e.g. "mom", "dad". If falsy, no request is
 *   made and the hook returns its initial idle state.
 * @returns {{
 *   room: object|null,
 *   roomLoading: boolean,
 *   roomError: {code: string, message: string}|null,
 *   refetchRoom: () => void,
 *
 *   section: object|null,
 *   sectionType: string|null,
 *   sectionLoading: boolean,
 *   sectionError: {code: string, message: string}|null,
 *   loadSection: (type: string) => Promise<boolean>,
 *   clearSection: () => void
 * }}
 */
export function useRoom(roomSlug) {
  // --- Base Room Experience state --------------------------------------
  const [room, setRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(Boolean(roomSlug));
  const [roomError, setRoomError] = useState(null);

  const roomAbortRef = useRef(null);

  const fetchRoom = useCallback(async () => {
    if (!roomSlug) {
      setRoom(null);
      setRoomLoading(false);
      setRoomError(null);
      return;
    }

    if (roomAbortRef.current) {
      roomAbortRef.current.abort();
    }

    const controller = new AbortController();
    roomAbortRef.current = controller;

    setRoomLoading(true);
    setRoomError(null);

    const result = await roomService.getRoomExperience(roomSlug, { signal: controller.signal });

    if (roomAbortRef.current !== controller) return;

    if (result.success) {
      setRoom(result.data);
      setRoomError(null);
    } else {
      setRoom(null);
      setRoomError(result.error);
    }

    setRoomLoading(false);
  }, [roomSlug]);

  useEffect(() => {
    fetchRoom();

    return () => {
      if (roomAbortRef.current) {
        roomAbortRef.current.abort();
      }
    };
  }, [fetchRoom]);

  // --- Sub-experience (Hear/Read/See/Memory) state ----------------------
  const [section, setSection] = useState(null);
  const [sectionType, setSectionType] = useState(null);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState(null);

  const sectionAbortRef = useRef(null);

  /**
   * Loads a specific sub-experience (Hear/Read/See/Memory) for the
   * current roomSlug. Returns true on success, false on failure.
   *
   * @param {string} type - one of ROOM_EXPERIENCE_TYPES
   * @returns {Promise<boolean>}
   */
  const loadSection = useCallback(
    async (type) => {
      const serviceFn = SECTION_SERVICE_MAP[type];

      if (!roomSlug || !serviceFn) {
        setSection(null);
        setSectionType(null);
        setSectionError({
          code: 'INVALID_REQUEST',
          message: 'A valid room and section type are required.',
        });
        return false;
      }

      if (sectionAbortRef.current) {
        sectionAbortRef.current.abort();
      }

      const controller = new AbortController();
      sectionAbortRef.current = controller;

      setSectionType(type);
      setSectionLoading(true);
      setSectionError(null);

      const result = await serviceFn(roomSlug, { signal: controller.signal });

      if (sectionAbortRef.current !== controller) return false;

      if (result.success) {
        setSection(result.data);
        setSectionError(null);
        setSectionLoading(false);
        return true;
      }

      setSection(null);
      setSectionError(result.error);
      setSectionLoading(false);
      return false;
    },
    [roomSlug]
  );

  /**
   * Clears the currently loaded sub-experience, e.g. when navigating
   * back from Hear/Read/See/Memory to the Room page itself.
   */
  const clearSection = useCallback(() => {
    if (sectionAbortRef.current) {
      sectionAbortRef.current.abort();
    }
    setSection(null);
    setSectionType(null);
    setSectionError(null);
    setSectionLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (sectionAbortRef.current) {
        sectionAbortRef.current.abort();
      }
    };
  }, []);

  return {
    room,
    roomLoading,
    roomError,
    refetchRoom: fetchRoom,

    section,
    sectionType,
    sectionLoading,
    sectionError,
    loadSection,
    clearSection,
  };
}

export default useRoom;