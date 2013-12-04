// Module
var Models;
(function (Models) {
    var PollAnswer = (function () {
        function PollAnswer(poll, option) {
            this.PollIdentifier = poll.Identifier;
            this.SelectedOptions = [option];
        }
        return PollAnswer;
    })();
    Models.PollAnswer = PollAnswer;
})(Models || (Models = {}));
//# sourceMappingURL=Models.js.map
