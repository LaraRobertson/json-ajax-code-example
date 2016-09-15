    <%--
        Copyright (c) 2002-2013, OnPoint Digital, Inc. All rights reserved
        Mike Palmer, 16 August, 2012
        @version 16 August, 2012 - Mike

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
        SOFTWARE.
    --%>
        <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
        <%@ taglib uri="/WEB-INF/cv_utils.tld" prefix="cv" %>
        <%@page import="com.opportal.Constants, com.opportal.Common"%>
        <%@page import="com.opportal.LaunchURL"%>
            <%
	String custID = (String)session.getAttribute(Constants.SESSION_CUSTID);

	// Retrieve the userID
	String userID = (String)session.getAttribute(Constants.SESSION_USERID);
	// Retrieve the user Role
    String role_id = (String) session.getAttribute(Constants.SESSION_USERROLE);

    String userName = (String) session.getAttribute(Constants.SESSION_USERNAME);

    String lastLogin = (String) session.getAttribute(Constants.SESSION_PORTALLOGIN);

	String siteURL = Common.getConfigValue(Constants.ADMIN_CUSTID, Constants.CFG_SITEURL);

	// Retrieve the Session ID
	String sessionID = session.getId();

	// Define the forward URL to be called after registering on the OnPoint Authenticator.
	String cm_forwardURL = session.getServletContext().getInitParameter("forward-opcm");
	String pm_forwardURL = session.getServletContext().getInitParameter("forward-oppm");
	// Instantiate a Launcher object
	LaunchURL launcher = new LaunchURL();
	launcher.setUid(userID);
	launcher.setObject_id("0");
	launcher.setJsession_id(session.getId());

	String generic_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("eventinstructor");
	String event_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("eventcalendar");
	String eventcalendar_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("eventcatalog");
	String eventcatalog_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("opcm");
	String cm_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("nuggetlist");
	String nuggetlist_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("oppm");
	String pm_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("certificates");
	String certificates_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("opdoc");
	String opdoc_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("games");
	String games_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("status");
	String status_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("courselist");
	String courses_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("activity");
	String activity_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("skillprofile");
	String skillprofile_launchCode = launcher.GenerateLaunchURL();

	launcher.setKeyword("forums");
	String forums_launchCode = launcher.GenerateLaunchURL();


	Boolean isEventInstructor = Common.isEventInstructor(userID);


	// grab the language for this user
	String  lang_id = "en";
	if (session.getAttribute("INITLANGCHAR") != null)
		lang_id =(String) session.getAttribute("INITLANGCHAR");
%>
<!doctype html>
<html lang="en">

            <%
  // Retrieve the file_name
  String fileName = request.getServletPath();
  int slashIndex = fileName.lastIndexOf('/');
  fileName = fileName.substring(slashIndex+1);
%>

<head>
	<meta charset="UTF-8">
	<meta name="description" content="Template: Cox">
	<meta name="author" content="OnPoint">

	<title>Cox</title>

	<!-- Mobile Specific Metas -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="mobile-web-app-capable" content="yes">

	<!--<link rel="stylesheet" href="stylesheets/foundation.min.css">-->
    <link rel="stylesheet" href="stylesheets/foundation.css">
    <link rel="stylesheet" href="stylesheets/swiper.css">
	<link rel="stylesheet" href="stylesheets/master.css">

  <!-- <link rel="stylesheet/less" href="stylesheets/master.less" /> -->

	<!-- Script Includes: Vendor -->
	<!--<script src="http://10.1.10.247:8080/target/target-script-min.js"></script>-->
	<script src="js/vendor.js"></script>
	<script src="js/socket.io.js"></script>
	<script src="js/foundation/foundation.min.js"></script>
	<script src="js/foundation/foundation.reveal.js"></script>
    <script type="text/javascript" src="/opportal/jscript/generic_portlet_functions.js"></script>
</head>
<body>

	<!-- Project Header -->
  <div class="site-wrapper">
        <header class="row">
            <div class="button menu columns small-1" data-trigger="nav">
                <div>
                    <i class="icon-list"></i>
                </div>
            </div>
            <div class="branding columns small-2" data-url="pgs/home/home.html">
            </div>
        <!--<div class="button right refresh" data-url="cellcast://action/sync" data-role="cellcast">
        <div>
        <i class="icon-refresh"></i>
        </div>
        </div>-->
            <div class="title columns small-6">
                <h1>INSPIRE Me</h1>
            </div>
            <div class="button right refresh columns small-3">
                <div data-nav="search" data-url="pgs/search/search-results.html" data-role="ajax">
                    <i class="icon-search"></i>
                </div>
                <div class="logout-btn" data-url="cellcast://action/sync" data-role="cellcast">
                    <div>
                        <p>Logout </p> <i class="icon-export"></i>
                    </div>
                </div>
            </div>
        </header>

    <!-- Wrap Contents That Will Be Moved As Navigation Is Exposed -->
    <div id="wrapper-container" data-role="wrapper-container">


      <!-- Project Content -->
      <div id="wrapper-content" data-role="wrapper-content">
        <!--<section id="load-content" attr="scrollMe" data-role="load-content">-->
        <opui-viewloader id="load-content" style="display:block;">
          <div class="load-wrapper">
            <div class="loader" data-key="loading">Loading...</div>
          </div>
          <center>
            <h2>Loading</h2>
          </center>
        </opui-viewloader>
        <!--</section>-->
      </div>
        <!-- Project Footer -->
        <footer>
        <div class="text-block">
        <!--<div class="bottomLogo"><img src="img/branding/cox-bottom-logo.png" /></div>-->
        <p id="copyright">Copyright 2015 Cox. | All Rights Reserved. | Powered by <a href="#" data-url="http://mlearning.com" data-role="external" style="color: #333"><u>OnPoint</u></a></p>
        </div>
        </footer>

    </div>

	<!-- Project Navigation -->
	<div id="wrapper-navigation" data-role="wrapper-navigation">
		<!--<div id="load-navigation" attr="scrollMe" data-role="load-navigation">
		</div>-->
        <!--<div data-load="pgs/navigation/navigation.html">-->
        <!--</div>-->
		<opui-menu>
      <!--<opui-userinfo>-->
        <!--<div class="user-info">-->
          <!--<p>Signed in as:</p>-->
          <!--<img src="{info.avatar}" alt=""/>-->
          <!--<h3>{info.user_name}</h3>-->
        <!--</div>-->
      <!--</opui-userinfo>-->
			<ul class="nav-list">
				<li each={items} class="selectable" onclick={parent.navigate} data-nav={navigation-indicator}>
					<div class="=">
						<div class="icon-block">
							<i class="icon-{icon}"></i>
						</div>
						<div class="text-block">
							<p><opui-phrase key="{key}" def="{title}"></opui-phrase></p>
						</div>
					</div>
				</li>
                <li onclick="openLink('events'); return true;" >
                    <div>
                        <div class="icon-block">
                            <i class="icon-calendar-2"></i>
                        </div>
                        <div class="text-block">
                            <p>Events</p>
                        </div>
                    </div>
                </li>
                <li data-nav="messages"  data-url="pgs/messages/selections.html">
                    <div>
                        <div class="icon-block">
                            <i class="icon-mail"></i>
                        </div>
                        <div class="text-block">
                            <p>Messages</p>
                        </div>
                    </div>
                </li>
                <li onclick="openLink('directory'); return true;" >
                    <div>
                        <div class="icon-block">
                            <i class="icon-drawer"></i>
                        </div>
                        <div class="text-block">
                            <p>Corporate Directory</p>
                        </div>
                    </div>
                </li>
                <!--<li onclick="openLink('announcements'); return true;" class="messages"><i class="icon-caret-right arrow"></i>Nuggets<span id="anmtcount"></span></li>
                <li onclick="openLink('notifications'); return true;" class="messages"><i class="icon-caret-right arrow"></i>Document Library<span id="ntfycount"></span></li>
                <li onclick="openLink('notifications'); return true;" class="messages last"><i class="icon-caret-right arrow"></i>Corporate Directory<span id="ntfycount"></span></li>-->
                <li if="{user_role === 'RM' || user_role === 'GM'}" class="message">
                    <div>
                        <div class="icon-block" style="padding-top: 13px;">
                            <i class="icon-stats"></i>
                        </div>
                        <div  class="text-block" style="padding-bottom: 3px;">
                            <p>Manager Options</p>
                        </div>
                    </div>
                </li>
                <li if="{user_role === 'RM' || user_role === 'GM'}" onclick="openLink('oppm'); return true;" class="messages">
                    <i class="icon-caret-right arrow"></i>
                    Performance Manager
                </li>
                <li if="{user_role === 'RM' || user_role === 'GM'}" onclick="openLink('opcm'); return true;" class="messages">
                    <i class="icon-caret-right arrow"></i>
                    Course Manager
                </li>
			</ul>
		</opui-menu>

	</div>
        <opui-back>
            <div id="back-btn" if="{show}" onclick="{goback}">
                <div>
                    <div class="icon-block">
                        <i class="icon-chevron-left"></i>
                    </div>
                    <div class="text-block">
                        <p class="title"></p>
                    </div>
                </div>
            </div>

        </opui-back>
  </div>


	<div class="reveal-modal" id="opui-modal" data-reveal>
		<span id="content"></span>
		<a class="close-reveal-modal" aria-label="Close">&#215;</a>
	</div>


	<opui-modal></opui-modal>

	<opui-modal id="legend" header="Legend" override>
		<div class="modal {show:show}" id="modal-one" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-header">
					<h2>Legend</h2>
					<a href="" class="btn-close" aria-hidden="true" onclick="{close}">×</a> <!--CHANGED TO "#close"-->
				</div>
				<div class="modal-body">
					<p>This is a legend, so freakin legend like John</p>
				</div>
				<div class="modal-footer">
					<a href="" class="btn" onclick="{close}">Close legend</a>  <!--CHANGED TO "#close"-->
				</div>
			</div>
		</div>
	</opui-modal>

	<opui-toast position="topright"></opui-toast>

	<div data-role="templates" style="display:none;" data-load="pgs/templates/templates.html"></div>

	<script>
		var translate = {

		}
	</script>




	<!-- Script Includes: OPUI -->
	<!--<script type="text/javascript" src="js/opui/AIRIntrospector.js"></script>-->

	<script src="js/charts/Chart.Core.js"></script>
	<script src="js/charts/Chart.PolarMax.js"></script>
    <script src="js/swiper.min-3.1.7.js"></script>
    <script src="js/opui.js"></script>
	<script src="tags/opui.tags.js"></script>
    <script src="js/app.js"></script>


	<!-- Project Specific Scripts -->
    <script type="text/javascript">
        if(opui.store){
            opui.store.setSecureID('<%=userID%>');
        }
        var theLocale = "<%=lang_id %>"
        var roleId = "<%=role_id %>";
        var isEventInstructor = <%=isEventInstructor %>;

        var userName = "<%=userName%>";
        var lastLogin = "<%=lastLogin%>";

        var pm_launchCode = '<%=pm_launchCode%>';
        var cm_launchCode = '<%=cm_launchCode%>';
        var certificates_launchCode = '<%=certificates_launchCode%>';
        var opdoc_launchCode = '<%=opdoc_launchCode%>';
        var games_launchCode = '<%=games_launchCode%>';
        var status_launchCode = '<%=status_launchCode%>';
        var skillprofile_launchCode = '<%=skillprofile_launchCode%>';
        var forums_launchCode = '<%=forums_launchCode%>';
        var generic_launchCode = '<%=generic_launchCode%>';
        var nuggetlist_launchCode = '<%=nuggetlist_launchCode%>';
        var eventcalendar_launchCode = '<%=eventcalendar_launchCode%>';
        var eventcatalog_launchCode = '<%=eventcatalog_launchCode%>';
        var cm_forwardURL = '<%=cm_forwardURL%>';
        var pm_forwardURL = '<%=pm_forwardURL%>';
        var courses_launchCode = '<%=courses_launchCode%>';
        var event_launchCode = '<%=event_launchCode%>';
        var activity_launchCode = '<%=activity_launchCode%>';
        var directory_forwardURL = '/opdirectory/Launch';

        function openLink(keyword){
            switch (keyword) {
                case 'mygames':
                    openOpcvWindow(games_launchCode, theLocale);
                    break;
                case 'opcm':
                    openOnPointAppWindow(cm_forwardURL, cm_launchCode, theLocale);
                    break;
                case 'oppm':
                    openOnPointAppWindow(pm_forwardURL, pm_launchCode, theLocale);
                    break;
                case 'opdoc':
                    openOnPointAppWindow("/opdoc/Launch", opdoc_launchCode, theLocale);
                    break;
                case 'eventinstructor':
                    openOpcvWindow(event_launchCode, theLocale);
                    break;
                case 'courses':
                    openOpcvWindow(courses_launchCode, theLocale);
                    break;
                case 'nuggetlist':
                    openOpcvWindow(nuggetlist_launchCode, theLocale);
                    break;
                case 'activity':
                    openOpcvWindow(activity_launchCode, theLocale);
                    break;
                case 'regcode':
                    window.parent.showNewWin("/opportal/portal_items/onpoint/mobile_reg_generator.jsp", "Generate Registration Code", 600, 600);
                    break;
                case 'myprogress':
                    openOpcvWindow(status_launchCode, theLocale);
                    break;
                case 'assignments':
                    openOpcvWindow(skillprofile_launchCode, theLocale);
                    break;
                case 'events':
                    openOpcvWindow(eventcalendar_launchCode, theLocale);
                    break;
                case 'eventcatalog':
                    openOpcvWindow(eventcatalog_launchCode, theLocale);
                    break;
                case 'certificates':
                    openOpcvWindow(certificates_launchCode, theLocale);
                    // window.open('/opcv/pages/matrix/user_certificates.jsp', 'opls', windowFeatures);
                    break;
                case 'forums':
                    openOpcvWindow(forums_launchCode, theLocale);
                    break;
                case 'directory':
                    openOnPointAppWindow(directory_forwardURL, generic_launchCode, theLocale);
                    break;
                case 'skillprofiles':
                    openOpcvWindow(skillprofile_launchCode, theLocale);
                    break;
                case 'search':
                    window.parent.showNewWin("/opportal/portal_items/onpoint/default_search_advanced.jsp", "Search", 700, 800);
                    break;
                case 'announcements':
                    window.parent.showNewWin("/opportal/portal_items/onpoint/utils/announcements.jsp", "Announcements", 700, 800);
                    break;
                case 'notifications':
                    window.parent.showNewWin("//opportal/portal_items/onpoint/utils/notifications.jsp", "Notifications", 700, 800);
                    break;
                default:
                    return true
                    break;
            }
        };
        $(document).ready(function(){
        // Adjust for width being reported incorrectly on the iPad -->
        var width = $(document).width();
        if(width == 1032){
        $('header').css('padding-right', '8px')
        }
        });

        function roleCheck(){
            if(roleId === 'SA' || roleId === 'RA'){
                $('[data-role="user"]').hide();
                $('[data-role="manager_options"]').show();
            }
            if(roleId === 'RM' || roleId === 'GM'){
                $('[data-role="user"]').hide();
                $('[data-role="manager_options"]').show();
            }
            if(roleId === 'CC' || roleId === 'CA' || roleId === 'EM'){
                $('[data-role="user"]').show();
                $('[data-role="manager_options"]').hide();
            }
            if(roleId === 'U' || roleId === 'L'){
                $('[data-role="user"]').show();
                $('[data-role="manager_options"]').hide();
            }
            if(isEventInstructor){
                $('[data-role="user"]').show();
                $('[data-role="manager_options"]').hide();
            }
        }

		$(document).ready(function(){

			$(document).foundation();

			// Adjust for width being reported incorrectly on the iPad -->
			var width = $(document).width();
			if(width == 1032){
				$('header').css('padding-right', '8px');
			}

            //roleCheck();
		});
	</script>
</body>
</html>
