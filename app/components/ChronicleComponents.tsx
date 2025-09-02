"use client";

import { type ReactNode, useState } from "react";
import Image from "next/image";
import { Story } from "../../lib/types";

// Chronicle-inspired Button Component
type ChronicleButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  fullWidth?: boolean;
}

export function ChronicleButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
  fullWidth = false,
}: ChronicleButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-full";

  const variantClasses = {
    primary: "bg-[var(--app-primary)] hover:bg-[var(--app-primary-hover)] text-white shadow-lg hover:shadow-xl",
    secondary: "bg-[var(--app-secondary)] hover:bg-[var(--app-secondary-hover)] text-[var(--app-foreground)] shadow-lg hover:shadow-xl",
    outline: "border-2 border-[var(--app-primary)] hover:bg-[var(--app-primary)] text-[var(--app-primary)] hover:text-white",
    ghost: "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]",
  };

  const sizeClasses = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

// Chronicle-inspired Input Component
type ChronicleInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number";
  maxLength?: number;
  actionIcon?: ReactNode;
  onActionClick?: () => void;
}

export function ChronicleInput({
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  type = "text",
  maxLength,
  actionIcon,
  onActionClick,
}: ChronicleInputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-6 py-4 bg-[var(--app-surface)] border-none rounded-full text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] transition-all duration-300 shadow-sm ${className} ${actionIcon ? 'pr-16' : ''}`}
      />
      {actionIcon && (
        <button
          type="button"
          onClick={onActionClick}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--app-foreground-muted)] hover:text-[var(--app-primary)] transition-colors duration-300"
        >
          {actionIcon}
        </button>
      )}
    </div>
  );
}

// Chronicle-inspired Textarea Component
type ChronicleTextareaProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
}

export function ChronicleTextarea({
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  rows = 4,
  maxLength,
}: ChronicleTextareaProps) {
  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-6 py-4 bg-[var(--app-surface)] border-none rounded-2xl text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)] transition-all duration-300 shadow-sm resize-none ${className}`}
      />
      {maxLength && value && (
        <div className="absolute bottom-3 right-4 text-xs text-[var(--app-foreground-muted)]">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

// Chronicle-inspired Card Component
type ChronicleCardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function ChronicleCard({
  children,
  className = "",
  onClick,
  hover = false,
}: ChronicleCardProps) {
  const baseClasses = "bg-[var(--app-card-bg)] backdrop-blur-sm border border-[var(--app-card-border)] rounded-2xl shadow-lg transition-all duration-300";
  const hoverClasses = hover || onClick ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Chronicle-inspired Avatar Component
type ChronicleAvatarProps = {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallback?: string;
}

export function ChronicleAvatar({
  src,
  alt = "",
  size = "md",
  className = "",
  fallback,
}: ChronicleAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  const showFallback = !src || imageError;

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[var(--app-primary)] flex items-center justify-center text-white font-medium relative ${className}`}>
      {!showFallback ? (
        <Image
          src={src!}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{fallback || alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
}

// Chronicle-inspired Pill Badge Component
type ChroniclePillProps = {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
  className?: string;
}

export function ChroniclePill({
  children,
  variant = "default",
  className = "",
}: ChroniclePillProps) {
  const variantClasses = {
    default: "bg-[var(--app-foreground)] text-[var(--app-background)]",
    primary: "bg-[var(--app-primary)] text-white",
    secondary: "bg-[var(--app-secondary)] text-[var(--app-foreground)]",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-[var(--app-error)] text-white",
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Chronicle-inspired Game/Story Card Component
type ChronicleGameCardProps = {
  title: string;
  description?: string;
  participants?: { id: string; name: string; avatar?: string }[];
  status?: string;
  round?: number;
  maxRounds?: number;
  onClick?: () => void;
  className?: string;
}

export function ChronicleGameCard({
  title,
  description,
  participants = [],
  status,
  round,
  maxRounds,
  onClick,
  className = "",
}: ChronicleGameCardProps) {
  return (
    <ChronicleCard onClick={onClick} hover className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-medium text-[var(--app-primary)] mb-2">
          {title}
        </h3>
        <div className="flex items-center space-x-3">
          {participants.length > 0 && (
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant, index) => (
                <ChronicleAvatar
                  key={index}
                  src={participant.avatar}
                  alt={participant.name}
                  size="sm"
                  fallback={participant.name}
                  className="border-2 border-[var(--app-surface)]"
                />
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-[var(--app-gray)] border-2 border-[var(--app-surface)] flex items-center justify-center text-xs font-medium text-[var(--app-foreground-muted)]">
                  +{participants.length - 3}
                </div>
              )}
            </div>
          )}
          {round && maxRounds && (
            <span className="text-sm text-[var(--app-foreground-muted)]">
              Round {round}/{maxRounds}
            </span>
          )}
          {status && (
            <ChroniclePill variant="primary">
              {status}
            </ChroniclePill>
          )}
        </div>
      </div>
      
      {description && (
        <p className="text-[var(--app-foreground-muted)] text-sm line-clamp-2 mb-0">
          {description}
        </p>
      )}
    </ChronicleCard>
  );
}

// Chronicle-inspired Loading Spinner
export function ChronicleSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-[var(--app-primary)] border-t-transparent`} />
  );
}

// Chronicle-inspired Section Header
type ChronicleSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function ChronicleSectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: ChronicleSectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-semibold text-[var(--app-foreground)] mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[var(--app-foreground-muted)] text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Chronicle-inspired Number Picker
type ChronicleNumberPickerProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function ChronicleNumberPicker({
  label,
  value,
  min,
  max,
  onChange,
  className = "",
}: ChronicleNumberPickerProps) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className={className}>
      <p className="text-[var(--app-foreground)] font-medium mb-3 px-6">
        {label}
      </p>
      <div className="flex gap-2 px-6 overflow-x-auto pb-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num)}
            className={`flex-shrink-0 w-12 h-12 rounded-full font-medium transition-all duration-300 ${
              value === num
                ? "bg-[var(--app-primary)] text-white shadow-lg"
                : "bg-[var(--app-surface)] text-[var(--app-foreground-muted)] hover:bg-[var(--app-accent-light)] hover:text-[var(--app-primary)]"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}



// Chronicle-inspired Create Story Component
type ChronicleCreateStoryProps = {
  onStoryCreated: (story: Story) => void;
  onCancel: () => void;
}

export function ChronicleCreateStory({
  onStoryCreated,
  onCancel,
}: ChronicleCreateStoryProps) {
  const [title, setTitle] = useState("");
  const [rounds, setRounds] = useState(3);
  const [roundDuration, setRoundDuration] = useState(3);
  const [votingDuration, setVotingDuration] = useState(2);
  const [maxParticipants, setMaxParticipants] = useState(3);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    
    setIsCreating(true);
    // Simulate story creation
    setTimeout(() => {
      const newStory: Story = {
        id: Date.now().toString(),
        title,
        description: `A collaborative story with ${rounds} rounds`,
        chapters: [],
        currentChapter: 1,
        maxChapters: rounds,
        isComplete: false,
        createdAt: new Date(),
        creator: { address: "0x000", username: "You" },
        tags: [],
        totalVotes: 0
      };
      setIsCreating(false);
      onStoryCreated(newStory);
    }, 1000);
  };







  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ChronicleSectionHeader
        title="Create Story"
        subtitle="Set up your collaborative storytelling adventure"
      />
      
      <ChronicleCard className="p-8 space-y-6">
        <div>
          <label className="block text-[var(--app-foreground)] font-medium mb-3">
            Title
          </label>
          <ChronicleInput
            placeholder="Enter story title"
            value={title}
            onChange={setTitle}
          />
        </div>

        <ChronicleNumberPicker
          label="Rounds"
          value={rounds}
          min={3}
          max={10}
          onChange={setRounds}
        />

        <ChronicleNumberPicker
          label="Round duration (minutes)"
          value={roundDuration}
          min={3}
          max={10}
          onChange={setRoundDuration}
        />

        <ChronicleNumberPicker
          label="Voting duration (minutes)"
          value={votingDuration}
          min={2}
          max={10}
          onChange={setVotingDuration}
        />

        <ChronicleNumberPicker
          label="Maximum participants"
          value={maxParticipants}
          min={3}
          max={10}
          onChange={setMaxParticipants}
        />

        <div className="flex gap-4 pt-4">
          <ChronicleButton
            onClick={onCancel}
            variant="ghost"
            fullWidth
          >
            Cancel
          </ChronicleButton>
          <ChronicleButton
            onClick={handleCreate}
            variant="secondary"
            disabled={!title.trim() || isCreating}
            fullWidth
            icon={isCreating ? <ChronicleSpinner size="sm" /> : undefined}
          >
            {isCreating ? "Creating..." : "Create"}
          </ChronicleButton>
        </div>
      </ChronicleCard>
    </div>
  );
}
