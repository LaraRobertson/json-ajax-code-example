<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" %>
<%@ taglib uri="/WEB-INF/cv_utils.tld" prefix="cv" %>
<%@ page import="com.opportal.Common" %>
<%@ page import="com.opportal.Constants" %>
<%
	String helpKey = "";
    if (session.getAttribute(Constants.SESSION_HELPKEY) != null)
        helpKey = (String)session.getAttribute(Constants.SESSION_HELPKEY);
        
    // retrieve the help url
	//String helpUrl = Common.getConfigValue(cust_id, Constants.CFG_HELP_URL);
	//if (helpUrl.length() < 1)
	String helpUrl = "http://63.246.31.12/library/c1/LithiaPortal_QuickReferenceGuide.pdf";
		
	// append parameters
	helpUrl += "?app=opportal";
	if (helpKey.length() > 0)
		helpUrl += "&key="+helpKey;	    
%> 
<html xmlns="http://www.w3.org/1999/xhtml">
<%
  // Retrieve the file_name
  String fileName = request.getServletPath();
  int slashIndex = fileName.lastIndexOf('/');
  fileName = fileName.substring(slashIndex+1);
%>
<head>
<title>Untitled Document</title>
<cv:itemStyle item_id="<%=fileName %>"></cv:itemStyle>

<script type="text/javascript">

/***********************************************
* Advanced Gallery script- ?Dynamic Drive DHTML code library (www.dynamicdrive.com)
* This notice must stay intact for legal use
* Visit http://www.dynamicdrive.com/ for full source code
***********************************************/

var tickspeed=3000 //ticker speed in miliseconds (2000=2 seconds)
var displaymode="auto" //displaymode ("auto" or "manual"). No need to modify as form at the bottom will control it, unless you wish to remove form.

if (document.getElementById){
document.write('<style type="text/css">\n')
document.write('.gallerycontent{display:none;}\n')
document.write('</style>\n')
}

var selectedDiv=0
var totalDivs=0

function getElementbyClass(classname){
partscollect=new Array()
var inc=0
var alltags=document.all? document.all.tags("DIV") : document.getElementsByTagName("*")
for (i=0; i<alltags.length; i++){
if (alltags[i].className==classname)
partscollect[inc++]=alltags[i]
}
}

function contractall(){
var inc=0
while (partscollect[inc]){
partscollect[inc].style.display="none"
inc++
}
}

function expandone(){
var selectedDivObj=partscollect[selectedDiv]
contractall()
selectedDivObj.style.display="block"
if (document.gallerycontrol)
temp.options[selectedDiv].selected=true
selectedDiv=(selectedDiv<totalDivs-1)? selectedDiv+1 : 0
if (displaymode=="auto")
autocontrolvar=setTimeout("expandone()",tickspeed)
}

function populatemenu(){
temp=document.gallerycontrol.menu
for (m=temp.options.length-1;m>0;m--)
temp.options[m]=null
for (i=0;i<totalDivs;i++){
var thesubject=partscollect[i].getAttribute("subject")
thesubject=(thesubject=="" || thesubject==null)? "HTML Content "+(i+1) : thesubject
temp.options[i]=new Option(thesubject,"")
}
temp.options[0].selected=true
}

function manualcontrol(menuobj){
if (displaymode=="manual"){
selectedDiv=menuobj
expandone()
}
}

function preparemode(themode){
displaymode=themode
if (typeof autocontrolvar!="undefined")
clearTimeout(autocontrolvar)
if (themode=="auto"){
document.gallerycontrol.menu.disabled=true
autocontrolvar=setTimeout("expandone()",tickspeed)
}
else
document.gallerycontrol.menu.disabled=false
}


function startgallery(){
if (document.getElementById("controldiv")) //if it exists
document.getElementById("controldiv").style.display="block"
getElementbyClass("gallerycontent")
totalDivs=partscollect.length
if (document.gallerycontrol){
populatemenu()
if (document.gallerycontrol.mode){
for (i=0; i<document.gallerycontrol.mode.length; i++){
if (document.gallerycontrol.mode[i].checked)
displaymode=document.gallerycontrol.mode[i].value
}
}
}
if (displaymode=="auto" && document.gallerycontrol)
document.gallerycontrol.menu.disabled=true
expandone()
}

if (window.addEventListener)
window.addEventListener("load", startgallery, false)
else if (window.attachEvent)
window.attachEvent("onload", startgallery)
else if (document.getElementById)
window.onload=startgallery

</script>
<script language="JavaScript" type="text/javascript">
<!--
function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}
MM_reloadPage(true);
//-->
</script>
<style type="text/css">
<!--
.style1 {
	font-family: Arial, Helvetica, sans-serif;
	font-size: small;
}
.style2 {
	font-family: Arial, Helvetica, sans-serif;
	font-size: medium;
	font-weight: bold;
	margin:0px;
}
-->
</style>
</head>
<body onload="preparemode('manual')">
<table width="100%" border="0" cellspacing="0" cellpadding="0" class="popup_window">
  <tr>
    <td valign="top">  <div style="line-height:10px;">&nbsp;</div>
  <table width="580" border="0" cellpadding="2" cellspacing="0">
  <tr>
	  <td height="25" bgcolor="#f5f5f5" class="style2">Technical Help </td>
  </tr>
  <tr>
	  <td><div style="margin-left:10px; margin-top:10px; width:335px;clear:both; float:left">
	    <p class="style1" style="margin-bottom:4px; margin-top:3px "><img src="/opportal/portal_items/c1/images/pdf.gif" alt="pdf" width="17" height="17" align="absmiddle" /> <a href="/opportal/portal_items/c1/Acme_FastStartGuide.pdf" target="_blank">Download User Fast Start Guide</a></p>
	    
	    <p class="style1" style="margin-bottom:3px; margin-top:3px "><img src="/opportal/portal_items/c1/images/pdf.gif" alt="pdf" width="17" height="17" align="absmiddle" /> <a href="/opportal/portal_items/c1/Acme_Portal_UserGuide.pdf" target="_blank">Download User Quick Reference Guide</a></p>
		<p style="margin-bottom:3px; margin-top:3px "><span class="style1" style="margin-bottom:3px; margin-top:3px "><img src="/opportal/portal_items/c1/images/pdf.gif" alt="pdf" width="17" height="17" align="absmiddle" /> <a href="/opportal/portal_items/c1/Generic_OPDOC_FastStartGuide.pdf" target="_blank">Download Doc Manager User Quick Reference Guide</a></span></p>
		</div>
		
		</td>
	  
	  </tr>
  <tr>
	  <td height="20"></td>
  </tr>	
  <tr>
	  <td height="25" bgcolor="#f5f5f5" class="style2">Portal Links (Click for summary) </td>
      </tr>	
  <tr>
	  <td valign="top" class='tag'>
	 <div style="line-height:10px">&nbsp;</div>
	  	  <table   border="1" cellspacing="0" cellpadding="10">
        <tr>
          <td height="300" align="left" valign="top" style="min-width:150px;"><div id="controldiv" style="display:none;" class="gallerycontroller">
<form name="gallerycontrol" id="gallerycontrol">

<select class="gallerycontroller" size="13" name="menu" onchange="manualcontrol(this.options.selectedIndex)">
<option>Blank form</option>
</select>
</form>
</div></td>
          <td align="left" valign="top" bgcolor="#EFEFEF" height="170" width="345"><div class="gallerycontent" subject="Portal Overview">
<h3 class="style2">Portal Overview</h3>
  <p><span class="style1">The Learning Center Portal provides a unified interface for all employees, customers and members to access training related information and applications. Think of the Learning Center Portal as a doorway through which our community will access anything related to learning. Inside the Portal, users can view any announcements or personal notifications they mave have, access a reference library, search for information or courseware, access pending assignments, register for instructor-led training, etc. You may also update your personal profile and monitor your personal progress and success. </span></p>
  <p><span class="style1">Click on the different portal link headings to the left of this Overview for a brief descriptive summary of each area. More detail can be accessed by downloading the Reference Guide PDFs above. </span></p>
          </div>

            <div class="gallerycontent" subject="Messages">
  <h3 class="style2">Messages</h3>
  <p><span class="style1"> Click Announcements to review information that is normally general in nature. Announcements are usually broadcast to all members of a group you belong to, and come from a specific person. </span></p>
  <p><span class="style1"> Click Notifications to review information that has been sent specifically to you. Notifications are system-generated notices that are typically reminders about meeting certain mandatory deadlines for course completion. You may remove a Notification, but until you meet the requirement, the Notification will return. </span></p>
  </div> 

<div class="gallerycontent" subject="Nuggets">
<h3 class="style2">Learning Nuggets </h3>
  <p><span class="style1"> Click the Learning Nuggets link for a list of short learning clips. Nuggets are brief selections from courses, designed to provide quick reviews on a specific subject that may be helpful when you need a refresher but you&rsquo;re short on time. </span></p>
</div>

<div class="gallerycontent" subject="Document Library">
<h3 class="style2">Document Library</h3>
  <p><span class="style1">Use the drop-down  menus to locate documents by subject or categorization.&nbsp; Alternatively,  use the Search field to search for a document by name or subject.&nbsp; The  search function here works slightly differently from the search function within  the Portal:</span></p>
  <ol><span class="style1">
    <li>Searching from the Portal:&nbsp;the search results are categorized by  object class (Courses, Assessments, Nuggets, Events, and Activities), by  Documents in the Library, and by Personnel in the system.&nbsp; Under the  Documents heading, you will see all documents that match the search criteria  listed and can get additional information about them -- regardless of whether  you have access rights to the documents or not -- but they cannot be accessed  from this results view.</li><br />
    
    <li>Searching from within the Document Library:&nbsp;the search results will  only list documents that meet the search criteria AND that are accessible based  on your security rights (i.e. your group-based &ldquo;read&rdquo; access rights).&nbsp; The  system will not return any files in the results that you would not have the  ability to access.</li></span>
  </ol>
</div>

<div class="gallerycontent" subject="Directory"> 
  <h3 class="style2">Directory</h3>
  <p><span class="style1"> Click the Directory link to access a list of Contacts. You may search for an individual by clicking on the Advanced Search link. Also, sorting may be available by clicking on column headings. </span></p>
</div>

<div class="gallerycontent" subject="Quick Links">
<h3 class="style2">Quick Links</h3>
  <p><span class="style1"> Click any additional Quick Links available to go directly to that corresponding website. When you are finished there, simply click the &ldquo;close&rdquo; icon to close the window and return to the Learning Center Portal. </span></p>
</div>

<div class="gallerycontent" subject="Portal Search">
  <h3 class="style2">Search</h3>
  <p><span class="style1"> Enter a word or phrase into the Search field, and click the Go button. The Search function will search across the entire Learning Center Portal and provide the findings in a table, organized by Courses, Assessments, Events, Activities, Nuggets, and Library items. From here you can launch any items you are already assigned to, or find other items you may wish to register for. </span></p>
  <p><span class="style1">Click Advanced Search to further refine your search. </span></p>
</div>
  <div class="gallerycontent" subject="Manager Options">
  <h3 class="style2">Manager Options </h3>
  <p> <span class="style1"><em>Performance Manager:</em> If you are a Manager, you will see one or more Manager Options, depending on your role. Click the Performance Manager Link to enter the OnPoint Performance Manager application. You will not need to login again. Refer to the Manager Guide PDF above for additional information. </span></p>
  <p><span class="style1"><em>Course Manager: </em> If you are a Manager, you will see one or more Manager Options, depending on your role. Click the Course Manager Link to enter the OnPoint Course Manager application. You will not need to login again. </span></p>
  </div>
  <div class="gallerycontent" subject="Online Learning Tabs">
  <h3 class="style2">Online Learning Tabs</h3>
  <p><span class="style1">  Click the appropriate Tab to access online training. Portal Tabs may include one or more of the following: </span></p>
  <ul>
    <li><span class="style1"> Learning Path: a consolidated view of all your assignments, by Skill Profile grouping </span></li>
    <li><span class="style1"> Courses: a list of all online Courses assignments, as well as any standalone Tests assignments </span></li>
    <li><span class="style1"> Events: a calendar display of instructor-led or webinar &ldquo;events&rdquo; you have been assigned to attend </span></li>
    <li><span class="style1"> Activities: a listing of assigned &ldquo;to-do&rdquo; items that you need to complete off-line </span></li>
    <li><span class="style1"> My Status: a &ldquo;report card&rdquo; of your progress to date, including completion status and test scores </span></li>
  </ul>
  </div>
  <div class="gallerycontent" subject="Pending Assignments">
  <h3 class="style2">Pending Assignments</h3>
  <p><span class="style1">  This area of the portal displays your current assignments that are pending completion. Click on the name of any pending assignment to review its description, then you may choose to start or resume it as needed. </span></p>
  </div>
  <div class="gallerycontent" subject="My Profile">
  <h3 class="style2">My Profile</h3>
  <p><span class="style1">   Click the My Profile link to update your personal profile, such as a new address or telephone number. </span></p>
  </div>
   <div class="gallerycontent" subject="Help">
     <h3 class="style2">Help</h3>
  <p><span class="style1">This link provides brief descriptions of each area of the Portal, and provides downloadable PDF files for additional information.</span></p>
  </div>
  <div class="gallerycontent" subject="Logout">
  <h3 class="style2">Logout</h3>
  <p><span class="style1">    When you are finished using the Learning Center Portal, click the Logout icon in the upper right corner. The system will ask if you are sure. Click the OK button to end your session. </span></p>
  </div>
  

          </td>
        </tr>
      </table></td>
	  </tr>

</table>
    
      </div></td>
  </tr>
</table>
</body>
</html>
