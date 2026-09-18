package com.ceylonGo.itinerary.dto;

import java.util.List;

/** Ordered list of itinerary item IDs, in the new desired order. */
public class ReorderRequest {
    private List<Long> itemIdsInOrder;

    public List<Long> getItemIdsInOrder() { return itemIdsInOrder; }
    public void setItemIdsInOrder(List<Long> itemIdsInOrder) { this.itemIdsInOrder = itemIdsInOrder; }
}
