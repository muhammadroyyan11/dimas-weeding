export interface GroomData {
  name: string;
  father: string;
  mother: string;
  nickname: string;
}

export interface BrideData {
  name: string;
  father: string;
  mother: string;
  nickname: string;
}

export interface ReceptionData {
  date: string;
  time: string;
  location: string;
  address: string;
  mapUrl: string;
  googleMapsEmbed: string;
}

export interface LoveStoryItem {
  date: string;
  title: string;
  description: string;
}

export interface HeroData {
  greeting: string;
  subtitle: string;
  date: string;
  footer: string;
}

export interface MusicData {
  url: string;
  enabled: boolean;
}

export interface WeddingThemeData {
  groom: GroomData;
  bride: BrideData;
  reception: ReceptionData;
  loveStory: LoveStoryItem[];
  hero: HeroData;
  music: MusicData;
  theme: string;
  coverImage: string;
  groomImage: string;
  brideImage: string;
}

export interface CommentData {
  id: number;
  name: string;
  message: string;
  attendance: string;
  createdAt: string;
  approved: boolean;
}

export interface GalleryItemData {
  id: number;
  url: string;
  caption: string;
}

export interface ThemeProps {
  data: WeddingThemeData;
  comments: CommentData[];
  gallery: GalleryItemData[];
  guestName?: string;
}
