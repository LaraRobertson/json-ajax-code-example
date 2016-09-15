<%-- Set the content type header with the JSP directive --%>
<%@ page contentType="application/json" %>

<%-- Set the content disposition header --%>
<%
   response.setContentType("application/json");
   response.setHeader("Content-Disposition", "inline");
%>


    <%@ page language="java" %>
    <%@ taglib uri="/WEB-INF/cv_utils.tld" prefix="cv" %>
    <%@ taglib uri="/WEB-INF/op_utils.tld" prefix="op" %>
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

    // String generic_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("eventinstructor");
    // String event_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("eventcalendar");
    // String eventcalendar_launchCode = launcher.GenerateLaunchURL();

    

    // launcher.setKeyword("oppm");
    // String pm_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("opdoc");
    // String opdoc_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("status");
    // String status_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("skillprofile");
    // String skillprofile_launchCode = launcher.GenerateLaunchURL();

    // launcher.setKeyword("forums");
    // String forums_launchCode = launcher.GenerateLaunchURL();

    // Boolean isEventInstructor = Common.isEventInstructor(userID);

    // launcher.setKeyword(request.getParameter("keyword"));
    // String requested_launchCode = launcher.GenerateLaunchURL();

    // grab the language for this user
    String  lang_id = "en";
    if (session.getAttribute("INITLANGCHAR") != null)
        lang_id =(String) session.getAttribute("INITLANGCHAR");

    
    String launchCode;
    String forwardURL;
    String generic_launchCode = launcher.GenerateLaunchURL();
    
    switch (request.getParameter("keyword")){
        case "opcm":
            launcher.setKeyword("opcm");
            launchCode = launcher.GenerateLaunchURL();
            forwardURL = session.getServletContext().getInitParameter("forward-opcm");
            break;
        case "oppm":
            launcher.setKeyword("oppm");
            launchCode = launcher.GenerateLaunchURL();
            forwardURL = session.getServletContext().getInitParameter("forward-oppm");
            break;
        case "opdoc":
            launcher.setKeyword("opdoc");
            launchCode = launcher.GenerateLaunchURL();
            forwardURL = "/opdoc/Launch";
            break;
        case "directory":
            launcher.setKeyword("directory");
            launchCode = generic_launchCode;
            forwardURL = "/opdirectory/Launch";
            break;
        case "announcements":
            launcher.setKeyword("directory");
            launchCode = generic_launchCode;
            forwardURL = "/opportal/portal_items/onpoint/utils/announcements.jsp";
            break;
        case "constants":
            launcher.setKeyword("directory");
            launchCode = generic_launchCode;
            forwardURL = "/opportal/portal_items/onpoint/utils/announcements.jsp";
            break;

        default:
            launchCode = launcher.GenerateLaunchURL();
            forwardURL = "";
    }


%>

{
    "launch_code": "<%=launchCode%>",
    "forward_url": "<%=forwardURL%>",
    "locale": "<%=lang_id%>"
}