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
    String constantString;
    
    switch (request.getParameter("keyword")){
        case "lastLogin":
            constantString = lastLogin;
            break;
        case "eventInstructor":
            if(Common.isEventInstructor(userID)){
                constantString = "isInstructor";
            } else {
                constantString = "notInstructor";
            }
            break;
        default:
            constantString = "";
    }


%>

{
    "constant_requested": "<%=constantString%>"
}