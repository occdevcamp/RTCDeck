
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

    export interface SlideIndices {
        indexh: number;
        indexv: number;
    }

    export interface Poll {
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
    export class PollAnswer {
        constructor(poll: Poll, option: PollOption) {
            this.PollIdentifier = poll.Identifier;
            this.SelectedOptions = [option];
        }
        public PollIdentifier: string;
        public SelectedOptions: PollOption[];
    }

}