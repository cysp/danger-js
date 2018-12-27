"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Violation_1 = require("../../dsl/Violation");
/**
 * Converts a set of violations into a HTML table
 *
 * @param {string} name User facing title of table
 * @param {string} emoji Emoji name to show next to each item
 * @param {Violation[]} violations for table
 * @returns {string} HTML
 */
function table(name, emoji, violations) {
    if (noViolationsOrAllOfThemEmpty(violations)) {
        return "";
    }
    return "\n<table>\n  <thead>\n    <tr>\n      <th width=\"50\"></th>\n      <th width=\"100%\" data-danger-table=\"true\">" + name + "</th>\n    </tr>\n  </thead>\n  <tbody>" + violations.map(function (violation) { return htmlForValidation(emoji, violation); }).join("\n") + "</tbody>\n</table>\n";
}
function htmlForValidation(emoji, violation) {
    var message = Violation_1.isInline(violation)
        ? "**" + violation.file + "#L" + violation.line + "** - " + violation.message
        : violation.message;
    if (containsMarkdown(message)) {
        message = "\n\n  " + message + "\n  ";
    }
    return "<tr>\n      <td>:" + emoji + ":</td>\n      <td>" + message + "</td>\n    </tr>\n  ";
}
function containsMarkdown(message) {
    return message.match(/[`*_~\[]+/g) ? true : false;
}
function noViolationsOrAllOfThemEmpty(violations) {
    return violations.length === 0 || violations.every(function (violation) { return !violation.message; });
}
var truncate = function (msg, count) {
    if (!msg) {
        return msg;
    }
    if (msg.length < count) {
        return msg;
    }
    else {
        return msg.substr(0, count - 3) + "...";
    }
};
function getSummary(label, violations) {
    return violations
        .map(function (x) { return truncate(x.message, 20); })
        .reduce(function (acc, value, idx) { return acc + " " + value + (idx === violations.length - 1 ? "" : ","); }, violations.length + " " + label + ": ");
}
function buildSummaryMessage(dangerID, results) {
    var fails = results.fails, warnings = results.warnings, messages = results.messages, markdowns = results.markdowns;
    var summary = "  " + getSummary("failure", fails) + "\n  " + getSummary("warning", warnings) + "\n  " + (messages.length > 0 ? messages.length + " messages" : "") + "\n  " + (markdowns.length > 0 ? markdowns.length + " markdown notices" : "") + "\n  " + exports.dangerIDToString(dangerID);
    return summary;
}
exports.dangerIDToString = function (id) { return "DangerID: danger-id-" + id + ";"; };
exports.fileLineToString = function (file, line) { return "  File: " + file + ";\n  Line: " + line + ";"; };
exports.dangerSignature = function (results) {
    var meta = results.meta || { runtimeName: "dangerJS", runtimeHref: "https://danger.systems/js" };
    return "Generated by :no_entry_sign: <a href=\"" + meta.runtimeHref + "\">" + meta.runtimeName + "</a>";
};
/**
 * Postfix signature to be attached comment generated / updated by danger.
 */
exports.dangerSignaturePostfix = function (results, commitID) {
    return exports.dangerSignature(results) + " against " + commitID;
};
/**
 * Comment to add when updating the PR status when issues are found
 */
exports.messageForResultWithIssues = ":warning: Danger found some issues. Don't worry, everything is fixable.";
/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {string} dangerID A string that represents a unique build
 * @param {string} commitID The hash that represents the latest commit
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
function template(dangerID, commitID, results) {
    return "\n<!--\n" + buildSummaryMessage(dangerID, results) + "\n-->\n" + table("Fails", "no_entry_sign", results.fails) + "\n" + table("Warnings", "warning", results.warnings) + "\n" + table("Messages", "book", results.messages) + "\n" + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n<p align=\"right\">\n  " + exports.dangerSignaturePostfix(results, commitID) + "\n</p>\n";
}
exports.template = template;
function inlineTemplate(dangerID, results, file, line) {
    var printViolation = function (emoji) { return function (violation) {
        return "- :" + emoji + ": " + violation.message;
    }; };
    return "\n<!--\n" + buildSummaryMessage(dangerID, results) + "\n" + exports.fileLineToString(file, line) + "\n-->\n" + results.fails.map(printViolation("no_entry_sign")).join("\n") + "\n" + results.warnings.map(printViolation("warning")).join("\n") + "\n" + results.messages.map(printViolation("book")).join("\n") + "\n" + results.markdowns.map(function (v) { return v.message; }).join("\n\n") + "\n  ";
}
exports.inlineTemplate = inlineTemplate;
//# sourceMappingURL=githubIssueTemplate.js.map