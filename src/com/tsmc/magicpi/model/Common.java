package com.tsmc.magicpi.model;

public class Common {
	
	public static String getQueueName(String actionGroupId) {
		return MagicPiConstant.MESSAGE_QUEUE + "_" + actionGroupId;
	}

}
