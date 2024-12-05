import { VideoEditStore } from "./entities/video_edit_store.entity";
import { VideoStore } from "./entities/video_store.entity";

export const videoStoreProvider = [{ provide: 'videoStoreRepository', useValue: VideoStore }];
export const videoEditStoreProvider = [{ provide: 'videoEditStoreRepository', useValue: VideoEditStore }];

