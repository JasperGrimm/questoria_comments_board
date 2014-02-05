<?php

namespace Jasper\CommentsBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\CommentBundle\Entity\Comment as BaseComment;

/**
 * Comment
 *
 * @ORM\Table()
 * @ORM\Entity
 */
class Comment extends BaseComment
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;


    /**
     * @var string
     *
     * @ORM\Column(name="author", type="string")
     */
    protected $author;

    /**
     * Thread of $this comment
     *
     * @var Thread
     * @ORM\ManyToOne(targetEntity="Jasper\CommentsBundle\Entity\Thread")
     */
    protected $thread;

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }


    /**
     * Set thread
     *
     * @param \FOS\CommentBundle\Model\ThreadInterface $thread
     * @return Comment
     */
    public function setThread(\FOS\CommentBundle\Model\ThreadInterface $thread = null)
    {
        $this->thread = $thread;

        return $this;
    }

    /**
     * Get thread
     *
     * @return \Jasper\CommentsBundle\Entity\Thread 
     */
    public function getThread()
    {
        return $this->thread;
    }

    /**
     * Set author
     *
     * @param string $author
     * @return Comment
     */
    public function setAuthor($author)
    {
        $this->author = $author;

        return $this;
    }

    /**
     * Get author
     *
     * @return string 
     */
    public function getAuthor()
    {
        return $this->author;
    }
}
