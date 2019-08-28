<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\{ApiResource, ApiFilter};
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

/**
 * @ORM\Entity(repositoryClass="App\Repository\GameRepository")
 * @ApiFilter(OrderFilter::class, properties={"time"}, arguments={"orderParameterName"="order"})
 * @ApiResource
 */
class Game
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $time;

    /**
     * @ORM\Column(type="datetime")
     */
    private $moment;

    /**
     * Get Game id
     * @return int
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Get Game time in second.
     *
     * @return int
     */
    public function getTime(): ?int
    {
        return $this->time;
    }

    /**
     * Set Game time in second.
     *
     * @return Game
     */
    public function setTime(int $time): self
    {
        $this->time = $time;

        return $this;
    }

    /**
     * Get Game day and hour when was play the game
     *
     * @return DateTimeInterface
     */
    public function getMoment(): ?\DateTimeInterface
    {
        return $this->moment;
    }

    /**
     * Set Game day and hour when was play the game
     *
     * @return Game
     */
    public function setMoment(\DateTimeInterface $moment): self
    {
        $this->moment = $moment;

        return $this;
    }
}
