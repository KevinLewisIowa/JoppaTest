/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

// Allow importing heic2any without types
declare module 'heic2any';
