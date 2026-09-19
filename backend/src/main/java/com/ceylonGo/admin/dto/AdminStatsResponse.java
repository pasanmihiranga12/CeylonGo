package com.ceylonGo.admin.dto;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalTourists;
    private long totalGuides;
    private long verifiedGuides;
    private long totalDestinations;
    private long totalBookings;
    private long pendingBookings;
    private long confirmedBookings;
    private long totalReviews;
    private long flaggedReviews;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalTourists() { return totalTourists; }
    public void setTotalTourists(long totalTourists) { this.totalTourists = totalTourists; }
    public long getTotalGuides() { return totalGuides; }
    public void setTotalGuides(long totalGuides) { this.totalGuides = totalGuides; }
    public long getVerifiedGuides() { return verifiedGuides; }
    public void setVerifiedGuides(long verifiedGuides) { this.verifiedGuides = verifiedGuides; }
    public long getTotalDestinations() { return totalDestinations; }
    public void setTotalDestinations(long totalDestinations) { this.totalDestinations = totalDestinations; }
    public long getTotalBookings() { return totalBookings; }
    public void setTotalBookings(long totalBookings) { this.totalBookings = totalBookings; }
    public long getPendingBookings() { return pendingBookings; }
    public void setPendingBookings(long pendingBookings) { this.pendingBookings = pendingBookings; }
    public long getConfirmedBookings() { return confirmedBookings; }
    public void setConfirmedBookings(long confirmedBookings) { this.confirmedBookings = confirmedBookings; }
    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }
    public long getFlaggedReviews() { return flaggedReviews; }
    public void setFlaggedReviews(long flaggedReviews) { this.flaggedReviews = flaggedReviews; }
}
