'use strict';

// -----------------------------------------------------------------
//  This stub Zome code file was auto-generated by hc-scaffold
// -----------------------------------------------------------------

// -----------------------------------------------------------------
//  Exposed functions with custom logic https://developer.holochain.org/API_reference
// -----------------------------------------------------------------

/*
  EVENTS: 'events',
  HOST: 'host',
  HOSTING: 'hosting',
  TAG: 'tag',
*/

function groupCreate (groupEntry) {
  var groupHash = commit("group", groupEntry);
  // TODO: groups.json should eventually have explicit tags
  // if (tags && tags.length > 0) {
  //   for (var i = groupEntry.tags.length - 1; i >= 0; i--) {
  //     var tag = groupEntry.tags[i]
  //     commit('group_links', {
  //       Links: [{ Base: anchor('tag', tag), Link: groupHash, Tag: 'tag' }]
  //     });
  //   }
  // }
  return groupHash;
}

function groupRead (groupHash) {
  var group = get(groupHash);
  debug(groupHash + JSON.stringify(group))
  return JSON.stringify(group);
}

function groupUpdate (groupHash) {
  var sampleValue={"name":"a string","tags":["a string"],"extraField":true};
  var groupOutHash = update("group", sampleValue, groupHash);
  return groupOutHash;
}

function eventCreate (eventEntry) {
  var eventHash = commit("event", eventEntry);
  // Look up this event by its tags
  for (var i = eventEntry.tags.length - 1; i >= 0; i--) {
    var tag = eventEntry.tags[i]
    commit('event_links', {
      Links: [{ Base: anchor('tag', tag), Link: eventHash, Tag: 'tag' }]
    });
  }
  commit('event_links', {
    Links: [{ Base: eventHash, Link: eventEntry.groupHash, Tag: 'group' },
      { Base: eventHash, Link: App.Agent.Hash, Tag: 'host' },
      { Base: App.Agent.Hash, Link: eventHash, Tag: 'hosting' }]
  });
  commit('group_links', {
    Links: [{ Base: eventEntry.groupHash, Link: eventHash, Tag: 'events' }]
  });
  return eventHash;
}

function eventRead (eventHash) {
  var event = get(eventHash);
  return event;
}

function eventUpdate (eventHash) {
  var sampleValue={"name":"a string","date":"a string","location":"a string","tags":["a string"],"extraField":true};
  var eventOutHash = update("event", sampleValue, eventHash);
  return eventOutHash;
}

function rsvpCreate (rsvpEntry) {
  var rsvpHash = commit("rsvp", rsvpEntry);
  // {
  //   "attendees": {
  //     "minimum": 0,
  //     "default": 1,
  //     "type": "integer"
  //   },
  //   "event": {
  //     "type": "string",
  //     "pattern": ".+"
  //   },
  //   "ctime_iso8601_utc": {
  //     "type": "string",
  //     "pattern": ".+"
  //   }
  // }

  commit('event_links', {
    Links: [{ Base: rsvpEntry.event, Link: rsvpHash, Tag: 'rsvp' }]
  });
  commit('rsvp_links', {
    Links: [{ Base: rsvpHash, Link: App.Agent.Hash, Tag: 'member' }]
  })
  return rsvpHash;
}

function listRsvps(eventHash) {
  var rsvps = JSON.stringify(getLinks(eventHash, 'rsvp', {'Load': true}), null, 2)
  // var who = JSON.stringify(getLinks(rsvpHash, 'member'), null, 2)
  return rsvps // + "\n" + who
}

function rsvpRead (rsvpHash) {
  var rsvp = get(rsvpHash);
  return rsvp;
}

function rsvpUpdate (rsvpHash) {
  var sampleValue={"attendees":0,"event":"a string","ctime_iso8601_utc":"a string","extraField":true};
  var rsvpOutHash = update("rsvp", sampleValue, rsvpHash);
  return rsvpOutHash;
}

function rsvpDelete (rsvpHash) {
  var result = remove(rsvpHash, "");
  return result;
}

function userCreate (userEntry) {
  var userHash = commit("user", userEntry);
  return userHash;
}

function userRead (userHash) {
  var user = get(userHash);
  return user;
}

function userUpdate (userHash) {
  var sampleValue={"age":0,"name":"a string","email":"a string","extraField":true};
  var userOutHash = update("user", sampleValue, userHash);
  return userOutHash;
}

function hostGroup (text) {
  // your custom code here
  return "a string";
}

// TODO: implement
function attendEvent(text) {
  // create rsvps to event, and appropriate links
}
function hostEvent (params) {
  // commit('event_links', {
  //   Links: [
  //     {
  //       Base: App.Agent.Hash,
  //       Link: links[0].Hash,
  //       Tag: FIRST_NAME,
  //       LinkAction: HC.LinkAction.Del
  //     }
  //   ]
  // });
  commit('event_links', {
    Links: [{ Base: App.Agent.Hash, Link: eventHash, Tag: HOST }]
  });
  // your custom code here
  return {};
}

function listEventsIAmAttending(me) {
  getLinks(anchor('attendee', me), 'event', {Load: true})
}

function listGroupsByTag(tag) {
  var groupEntries = [];
  var eventLinks = getLinks(anchor('tag', tag), 'tag');
  debug(JSON.stringify(eventLinks))
  for (var i = 0; i < eventLinks.length; i++) {
    var groupHash = get(eventLinks[i].Hash).groupHash
    groupEntries.push(groupHash);
  }
  // TODO: Maybe include event's tags when listing groups too?
  return JSON.stringify(groupEntries);
}

function listEventsByTag (tag) {
  var eventEntries = [];
  eventLinks = getLinks(anchor('tag', tag), 'tag');
  for (var i = 0; i < eventLinks.length; i++) {
    eventEntries.push(get(eventLinks[i].Hash));
  }
  return JSON.stringify(eventEntries);
}

function listEventsByGroup (groupHash) {
  var eventEntries = {};
  eventLinks = getLinks(groupHash, 'events');
  for (var i = 0; i < eventLinks.length; i++) {
    eventHash = eventLinks[i].Hash
    eventEntries[eventHash]=get(eventHash);
  }
  return JSON.stringify(eventEntries);
}

function joinGroup (groupHash) {
  commit('group_links', {
    Links: [
      { Base: groupHash, Link: App.Agent.Hash, Tag: 'member' }
    ]
  });
  commit('group_links', {
    Links: [
      { Base: App.Agent.Hash, Link: groupHash, Tag: 'group' }
    ]
  });
  return "OK"
}



////// anchors

function anchor(anchorType, anchorText) {
  return call('anchors', 'anchor', {
    anchorType: anchorType,
    anchorText: anchorText
  }).replace(/"/g, '');
}

function anchorExists(anchorType, anchorText) {
  return call('anchors', 'exists', {
    anchorType: anchorType,
    anchorText: anchorText
  });
}

// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis () {
  return true;
}

// -----------------------------------------------------------------
//  Validation functions for every change to the local chain or DHT
// -----------------------------------------------------------------

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateCommit (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "group":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "rsvp":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "group_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return true;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validatePut (entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "group":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "rsvp":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "group_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return true;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {string} replaces - the hash for the entry being updated
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateMod (entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "group":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "rsvp":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "group_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return true;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {string} hash - the hash of the entry to remove
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateDel (entryName, hash, pkg, sources) {
  switch (entryName) {
    case "group":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "rsvp":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "group_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return true;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {string} baseHash - the hash of the base entry being linked
 * @param {?} links - ?
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateLink (entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "group":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "rsvp":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "event_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "group_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    case "user_links":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return true;
  }
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validatePutPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateModPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateDelPkg (entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateLinkPkg (entryName) {
  return null;
}