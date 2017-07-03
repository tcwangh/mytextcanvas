package com.tsmc.magicpi;

import java.io.IOException;
import java.util.HashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.tsmc.magicpi.model.Common;
import com.tsmc.magicpi.model.MagicPiConstant;

/**
 * Servlet implementation class GenSimulationTemplate
 */
@WebServlet("/GenSimulationTemplateServlet")
public class GenSimulationTemplateServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GenSimulationTemplateServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.generateSimulationTemplate(request,response);
	}
	
	private void generateSimulationTemplate(HttpServletRequest request, HttpServletResponse response) throws IOException{
		HttpSession session = request.getSession();
		String rtnCode = "0";
		String rtnMsg = "Normal End";
		String theActionGroupId = request.getParameter(MagicPiConstant.ACTION_GROUP_ID);
		String theMessageQueueName = Common.getQueueName(theActionGroupId);
		ConcurrentLinkedQueue<String> queue;
		if (session.getAttribute(theMessageQueueName) == null) {
			queue = new ConcurrentLinkedQueue<String>();
			session.setAttribute(theMessageQueueName, queue);
		}else {
			queue = (ConcurrentLinkedQueue<String>)session.getAttribute(theMessageQueueName);
		}
		queue.add("Received simulation action group " + theActionGroupId + ".");
		queue.add("Begin to parse action group content.");
		
		HashMap resultMap = new HashMap();
		resultMap.put("ReturnCode", rtnCode);
		resultMap.put("ReturnMessage", rtnMsg);
		String json = new Gson().toJson(resultMap);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
	}

}
