import rooms from '../mock/rooms';

/**
 * Returns the list of rooms shown on the mood page.
 * Backend will later decide which destinations to show and in what order.
 */
export function getRooms() {
  return rooms;
}