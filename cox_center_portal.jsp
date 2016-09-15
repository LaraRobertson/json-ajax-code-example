<%--
	Copyright (c) 2002-2013, OnPoint Digital, Inc. All rights reserved
	Josh Brown, 26 July, 2012
	@version 16 August, 2012 - Mike

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
--%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="/WEB-INF/cv_utils.tld" prefix="cv" %>
<%@include file="/template/handle_caching.jsp"%>
<%
    //  Retrieve the file_name
    String fileName = request.getServletPath();
    int slashIndex = fileName.lastIndexOf('/');
    fileName = fileName.substring(slashIndex + 1);
%>
<html>
    <head>
    <%-- Output CSS  --%>
    <cv:itemStyle item_id="<%=fileName%>"></cv:itemStyle>
    <script type="text/javascript" src="/opportal/jqueryui/jquery.min.js"></script>
    <script type="text/javascript">
    $(function () {
    // Get width of iframe that contains the centering portlet
    var width = $(document).width();

    window.parent.$('#mainWrapper').css({
    width: width,
    position: 'relative',
    margin: '0 auto',
    visibility: 'visible'
    });
    });
    </script>
    </head>
<body>


</body>
</html>