export interface CertificateProps {
    name: string;
    description: string;
    image: string;
    artist?: ArtistProps;
    material?: string;
    rarity?: string;
    medium?: string;
    frame?: string;

}

export interface ArtistProps {
  name: string;
  description: string;
}