package com.ceylonGo.messaging.repository;

import com.ceylonGo.messaging.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
           SELECT m FROM Message m
           WHERE (m.sender.id = :userA AND m.receiver.id = :userB)
              OR (m.sender.id = :userB AND m.receiver.id = :userA)
           ORDER BY m.sentAt ASC
           """)
    List<Message> findConversation(@Param("userA") Long userA, @Param("userB") Long userB);

    @Query("""
           SELECT m FROM Message m
           WHERE m.id IN (
               SELECT MAX(m2.id) FROM Message m2
               WHERE m2.sender.id = :userId OR m2.receiver.id = :userId
               GROUP BY CASE WHEN m2.sender.id = :userId THEN m2.receiver.id ELSE m2.sender.id END
           )
           ORDER BY m.sentAt DESC
           """)
    List<Message> findLatestMessagePerConversation(@Param("userId") Long userId);
}
