export interface HeartButtonProps {
  count?: number;
  /** Already hearted: turns red and disables — one heart per visitor, no undo. */
  hearted?: boolean;
  /** Article cards render read-only; the action lives on the article page. */
  readonly?: boolean;
  /** Flat variant for card footers, so it sits level with the format icons. */
  flat?: boolean;
  /** Small italic aside under the pill, e.g. "einmal pro Besuch". Kept to one
   *  short line — it renders `nowrap`, so a long phrase widens its container. */
  hint?: string;
  onHeart?: () => void;
  className?: string;
}
export declare function HeartButton(props: HeartButtonProps): JSX.Element;
