package com.tsmc.magicpi;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

/**
 * Servlet implementation class RunActionGroupServlet
 */
@WebServlet("/RunActionGroupServlet")
public class RunActionGroupServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RunActionGroupServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.executeActionGroup(request,response);
	}
	private void executeActionGroup(HttpServletRequest request, HttpServletResponse response) throws IOException {
		String rtnCode = "0";
		String rtnMsg = "Normal End";
		String reqYear = request.getParameter("reqYear").toString();
		String reqMonth = request.getParameter("reqMonth").toString();
		String accountId = request.getParameter("accountId").toString();
		System.out.println("[" + reqYear + "][" + reqMonth + "][" + accountId + "]");
			
		HashMap resultMap = new HashMap();
		resultMap.put("ReturnCode", rtnCode);
		resultMap.put("ReturnMessage", rtnMsg);
		String json = new Gson().toJson(resultMap);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}

}
