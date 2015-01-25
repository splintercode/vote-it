angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("about.html","<h1>About</h1>\r\n<p>\r\n    A simple real time team voting app. Simply have two or more people join a room (case sensitive) and you will be able to vote anonymously or\r\n    by name in real time. You can choose between yes, no and neutral. This is useful for teams to anonymously vote on technical issues or scrum cases.\r\n</p>\r\n<p>\r\n    <a href=\"https://github.com/splintercode\" target=\"_blank\" class=\"built-by\">Built by Cory Bateman</a>\r\n    <a href=\"https://plus.google.com/u/0/102986296317731631979?rel=author\" rel=\"publisher\"></a>\r\n</p>");
$templateCache.put("home.html","\r\n<form name=\"joinForm\" ng-submit=\"base.join()\">\r\n    <label for=\"UserName\">Name:</label>\r\n    <input type=\"text\" id=\"UserName\" name=\"userName\" ng-model=\"base.name\" required placeholder=\"Name\" />\r\n\r\n    <label for=\"VoteGroup\">Group: <small>(case sensitive)</small></label>\r\n    <input type=\"text\" id=\"VoteGroup\" name=\"groupName\" ng-model=\"base.group\" required placeholder=\"Group\" />\r\n\r\n    <div ng-messages=\"joinForm.groupName.$error\" ng-if=\'joinForm.groupName.$dirty\'>\r\n        <div ng-message=\"required\" class=\"message--error\">You must enter in a group name.</div>\r\n    </div>\r\n\r\n    <div ng-messages=\"joinForm.userName.$error\" ng-if=\'joinForm.userName.$dirty\'>\r\n        <div ng-message=\"required\" class=\"message--error\">You must enter in a user name.</div>\r\n    </div>\r\n\r\n    <button type=\"submit\" class=\"btn\">Save &amp; Join</button>\r\n</form>");
$templateCache.put("vote.html","<h1>Vote</h1>\r\n\r\n<div ng-repeat=\"type in base.voteTypes\">\r\n    <input type=\"radio\" ng-model=\"base.user.vote\" name=\"name\" value=\"{{type.value}}\" id=\"{{$index}}\" ng-change=\"base.vote(base.user.vote)\" required />\r\n    <label for=\"{{$index}}\">\r\n        {{type.value}}\r\n    </label>\r\n</div>\r\n\r\n<br />\r\n<small>Group: {{base.group}}</small>\r\n<ul class=\"user-list\">\r\n    <li ng-animate=\"\'animate\'\" ng-repeat=\"user in base.users\">\r\n        <div class=\"animated bounceIn user-status--valid\" ng-show=\"user.vote == \'Yes\'\"></div>\r\n        <div class=\"animated bounceIn user-status--invalid\" ng-show=\"user.vote == \'No\'\"></div>\r\n        <div class=\"animated bounceIn user-status\" ng-show=\"user.vote == \'Neutral\'\"></div>\r\n        <div class=\"user-name\">{{ user.userName }}</div>\r\n    </li>\r\n</ul>\r\n");}]);