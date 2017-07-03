package com.tsmc.magicpi;

import java.io.IOException;
import java.util.ArrayList;
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
 * Servlet implementation class ReadMessageQueue
 */
@WebServlet("/ReadMessageQueueServlet")
public class ReadMessageQueueServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ReadMessageQueueServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		readMessageQueue(request,response);
	}
	
	private void readMessageQueue(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String rtnCode = "0";
		String rtnMsg = "Normal End";
		HttpSession session = request.getSession();
		String theActionGroupId = request.getParameter(MagicPiConstant.ACTION_GROUP_ID);
		String theMessageQueueName = Common.getQueueName(theActionGroupId);
		ConcurrentLinkedQueue<String> queue;
		ArrayList<String> messageList = new ArrayList<String> ();
		if (session.getAttribute(theMessageQueueName) != null) {
			queue = (ConcurrentLinkedQueue<String>)session.getAttribute(theMessageQueueName);
			String str = null;
			int readCount = 0;
			while ((str = queue.poll()) != null && readCount < 10) {
				messageList.add(str);
			}
		}
		HashMap resultMap = new HashMap();
		resultMap.put("ReturnCode", rtnCode);
		resultMap.put("ReturnMessage", rtnMsg);
		resultMap.put("MessageList", messageList);
		String json = new Gson().toJson(resultMap);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}

}
