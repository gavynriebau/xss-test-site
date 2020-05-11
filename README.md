# XSS Test Site

**https://xss-test-site.azurewebsites.net/**

This is a micro site, simulating a very very bad bank for the purpose of learning about and practising cross site scripting (XSS) exploits.

# It's time to play a game

![saw_horror_movie.jpg](./docs/time_to_play_a_game.jpg)

There are two goals you should try on this site:

1. (Easy) Create an XSS exploit on the main page that pops open a javascript `alert`, e.g. `alert(document.domain)`
2. (A bit harder) Create an XSS exploit on the main page that, when triggered, causes a `fetch` (AJAX) request to be sent to transfer money to someone else's account.

## Background

XSS is a very common type of web vulnerability in which an attacker can cause javascript code to run in the context of a victim site and thus perform actions on behalf of a logged in user.

Depending on the nature of the site this can have really severe consequences, for example, this fake site simulates a bank where here the impact is that the attacker can steal money.

To steal money the attacker must trick the victim into clicking a link containing XSS which triggers a request on behalf of the victim user to transfer the money to the attacker's bank account.

## How to prevent XSS

Below are some strategies that can be used to either completely prevent or minimise the impact of XSS.
Ideally, following the defense in depth principle, multiple strategies would be applied.

### 1. Use a framework

Frameworks such as React, Angular and Vue will automatically perform escaping before inserting content into the DOM.
This is effective in most cases but there are still some scenarios where it can

### 2. Add a Content-Security-Policy (CSP) HTTP Header

[Content Security Policy](https://csp.withgoogle.com/docs/index.html) essentially works by adding a HTTP header to your server responses which triggers browsers to restrict the location from where scripts and other resources can be loaded.
When a policy is setup correctly this technique is highly effective at preventing nearly all XSS.

_More information:_

- [CSP with Google](https://csp.withgoogle.com/docs/index.html)
- [Stanford Web Security Lecture Slides](https://web.stanford.edu/class/cs253/lectures/Lecture%2007.pdf)

### 3. Escape input before injecting it into the DOM

This is really difficult to get right due to the different contexts which need to be thought about when escaping content. If you can't use a framework that provides escaping for you then it can be done manually.

## References

Code from this site is based on open content from the lecture notes for [Stanford University CS253 Web Security course](https://web.stanford.edu/class/cs253/).

I highly recommend watching these lectures by Feross Aboukhadijeh as they provide clear and entertaining explanations of many web security related topics ranging from the SameOrigin policy, Cross-Site Request Forgery, Content Security Policy and more.
