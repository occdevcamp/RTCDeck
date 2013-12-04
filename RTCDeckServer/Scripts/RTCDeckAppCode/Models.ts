
// Module
module Models {


    export interface SlideData {
        indexh: number;
        indexv: number;
        indexf?: number;
        speakerNotes?: string;
        supplementaryContent?: string
        polls?: Poll[];
    }

    export class Poll {
        Identifier: string;
        Question: string;
        Style: string;
        Options: PollOption[];
    }

    export interface PollOption {
        OptionID: number;
        OptionImagePath: string;
        OptionText: string;
    }

}