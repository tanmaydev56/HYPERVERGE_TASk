export interface VerificationResult {
  verified: boolean;
  confidence: number;
  issues: string[];
  details: {
    type: string;
    number?: string;
    name?: string;
    validity?: string;
  };
}
export interface PROPSIMAGEPREVIEW{
    isSelfieStep:boolean,
    openImagePicker:()=>void,
    documents:{[key:string]: string | null},
    currentDocument:{id:string,name:string,description:string}
}

export interface PropsCAMERA {
  onCapture: (uri: string) => void;
}
export interface PROPNAVIGATION{
    currentStep:number,
    handlePrevious:()=>void,
    handleNext:()=>void,
    documents:{[key:string]: string | null},
    currentDocument:{id:string,name:string,description:string},
    isLastStep:boolean,
    handleSubmit:()=>void,
    allDocumentsUploaded:boolean,
    loading?:boolean
}

export interface PROPSPROGRESSHEADER{
    currentStep:number,
    DOCUMENT_STEPS:{id:string,name:string,description:string}[],
    currentDocument:{id:string,name:string,description:string},
    progressFillWidth:string
}